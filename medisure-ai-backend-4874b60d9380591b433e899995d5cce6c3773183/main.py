from flask import Flask, request
from werkzeug.utils import secure_filename
from flask_cors import CORS

import os
from dotenv import load_dotenv, find_dotenv

from scripts.gpt import GPT, Example, set_openai_key
import openai

from google.cloud import storage

from scripts.vision import parse_table

import json


UPLOAD_FOLDER = os.path.join(".", "uploads")
ALLOWED_EXTENSIONS = {"pdf"}

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["CORS_HEADERS"] = "Content-Type"
CORS(app)

load_dotenv(find_dotenv(), override=True)
set_openai_key(os.getenv("GPT_SECRET_KEY", ""))

BUCKET_NAME = os.getenv("GOOGLE_BUCKET_NAME", "")
storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)


@app.route("/")
def hello_world():
    return "Hello, World!"


@app.route("/vision", methods=["GET", "POST"])
def parse_pdf():
    file = request.files["file"]
    filename = secure_filename(file.filename)
    filename = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filename)
    return parse_table(filename)[0]


vision_GPT = GPT(engine="davinci", temperature=0.5, max_tokens=200)
vision_qa_examples = [
    [
        "What is not included in the out of pocket limit?",
        "Premiums and health cares this plan does not cover are not included. Even though you pay these expenses, they do not count towards the limit",
    ],
    [
        "Do I need a referral to see a specialist?",
        "No. You can see a specialist you choose without permission from this plan.",
    ],
    [
        "Are diagnostic x-rays covered?",
        "In network diagnostics are a maximum of $10 copay while out of network diagnostics are not covered.",
    ],
]


@app.route("/vision/qa", methods=["GET", "POST"])
def question_answer():
    blob = bucket.blob(request.args.get("doc"))
    text = blob.download_as_text()
    vision_GPT.set_premise(text)
    vision_GPT.delete_all_examples()
    for example in vision_qa_examples:
        vision_GPT.add_example(Example(example[0], example[1]))
    prompt = request.data.decode("UTF-8")
    return vision_GPT.get_top_reply(prompt)


@app.route("/vision/summary", methods=["GET", "POST"])
def summarize_doc():
    blob = bucket.blob(request.args.get("doc"))
    prompt = "Could you summarize this in an easy to understand manner?"
    vision_GPT.set_premise(blob.download_as_text())
    vision_GPT.delete_all_examples()
    return vision_GPT.get_top_reply(prompt)


@app.route("/denial", methods=["GET", "POST"])
def parse_denial():
    file = request.files["file"]
    filename = secure_filename(file.filename)
    filename = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filename)
    data = parse_table(filename, condense=True)[1]
    text = "[[Letter]]:\nAetna \nP.O. Box 3013 Mad Stop U12W Blue Bell, PA 19422-0763\n\nPowell Gonzalez\n54 Creek Street\nPhiladelphia\nPA\n\nDear Mr. Powell\nThank you for your claim application for an Aetna Advantage Plans for Individuals, Families, and the Self-Employed. Your claim was for your condition of having trouble breathing. Based on the documents submitted, this condition was diagnosed on May 10, 2020 and the procedure took play on August 10, 2020 under Dr. Amit Patel of the Philadelphia General Hospital. After careful review of your application, we are unable to offer coverage and have declined the claim for the following reason(s): On review of the test reports submitted, this specific procedure of septoplasty did not meet the standard of being considered medically necessary and was deemed a cosmetic procedure. Our medical experts did not deem it medically necessary for your situation. This information may have come from your application, phone interview or medical records. Medical factors that we did not review this time may be considered.\n\n[[Summarized Version]]:Insurance Plan: Aetna Advantage Plus for Individuals, Families and Self-Employed\nReason: The reason the claim was denied was that the septoplasty procedure was deemed cosmetic and not medically necessary\nPatient Name: Powell Gonzalez\nPatient Plan State: PA\nDiagnosis Date: May 10, 2020\nTreatment Date: August 10, 2020\nCondition type: Respiratory\nCondition: Trouble breathing\nSupervising Doctor: Dr. Amit Patel\nTreatment/procedure name: septoplasty\n\n\n[[Letter]]:\nCigna\nCigna P.O. Box 8230 Mail, NY, NY 10027\n\nRachel Morrison\n75 Palace enclave\nLos Angeles\nCA\n\nDear Ms. Morrison,\nThis is regarding your recent claim under your Cigna MD PPO.  From the medical documents and forms submitted, your claim application for treatment was considered throughly. Your condition was diagnosed on December 10, 2018 and the gastric bypass treatment started June 10, 2019 under Dr. Mark Henderson of the Good Samaritan Hospital. We regret to inform you that we are unable to cover your claim for this treatment because of the following considerations: Through careful evaluation of your medical history, your condition of diabetes was deemed self-inflicted. Aetna's doctors and in-house medical expertise concluded that based on the test results submitted, despite an early diagnosis, patient behaviour did not change .  If you wish to do so, you may submit an appeal.\n\n[[Summarized Version]]:Insurance Plan: Cigna MD PPO\nReason: The reason the claim was denied was that the diabetes procedure was deemed self-inflicted\nPatient Name: Rachel Morrison\nPatient Plan State: CA\nDiagnosis Date: December 10, 2018\nTreatment Date: June 10, 2019\nCondition type: Diabetes\nCondition: Diabetes\nSupervising Doctor: Dr. Mark Henderson\nTreatment/procedure name: Gastric bypass\n\n"
    text += "[[Letter]]:\n" + data + "\n[[Summarized Text]]:"
    response = openai.Completion.create(
        engine="davinci",
        prompt=text,
        temperature=0.33,
        max_tokens=125,
        top_p=1,
        stop=["\n\n"],
    )
    responses = response["choices"][0]["text"].split("\n")
    print(responses)
    out = {}
    for response in responses:
        if ":" in response:
            parts = response.split(":")
            out[parts[0].strip()] = parts[1].strip()

    return out


@app.route("/denial/generate", methods=["GET", "POST"])
def create_denial():
    request.get_json(force=True)
    text = json.loads("".join(request.data.decode("UTF-8")))
    text = ", ".join([k + ": " + v for k, v in text.items()])
    print(text)
    # text = "Insurance Plan: Cigna MD PPO, Reason: self-inflicted, Patient Name: Rachel Morrison, Patient Age: 30, State: NY, Diagnosis Date: December 10, 2018, Treatment Date: June 10, 2019, Condition type: Diabetes, Condition: Diabetes, Supervising Doctor: Dr. Mark Henderson, Hospital: Mount Sinai Hospital, In-network provider: No, Treatment/procedure name: Gastric bypass"
    prompt = "[[Fields]]:\nInsurance Plan: Aetna MD bronze PPO, Reason: procedure was deemed cosmetic in nature, Patient Name: Justine Rose, Patient Age:66, State: CA, Diagnosis Date: December 10, 2018, Treatment Date: June 10, 2019, Condition type: Lipedema, Condition: Lipedema, Supervising Doctor: Dr. John Kerek, Hospital: San Francisco General Hospital, In-network provider: no, Treatment/procedure name: Complete Decongestive Therapy + specialized liposuction surgery , Life-threatening urgency: No \n\n\n[[Draft of Appeal Letter]]:\nDear Aetna Representative,\nI am writing to appeal Aetna's decision to deny coverage of treatments for Lipedema for me. I was first diagnosed with Lipedema on May 15, 2020. I had visited Dr. John of the San Francisco General Hospital, which is an in-network treatment provider, and on his strong recommendation commenced Complete Decongestive Therapy treatment on July 20, 2020 and underwent specialized liposuction surgery on August 10, 2020.\nIt is my understanding that Aetna is denying coverage on the basis that in the denial letter, the treatments required to treat Lipedema were labelled as cosmetic. My insurance plan, Aetna MD Bronze PPO, covers medically necessary services that are not expressly excluded, which are described in the Evidence of Coverage. Contrary to your letter, CDT and specialized lipsuction sould be covered service. According to California state law,  state’s mandated benefit laws requiring that the health plan provide this coverage, as Lipedema falls under chronic diseases. \nLipedema is a condition that occurs because of an abnormal accumulation of fat under the skin, triggered by a genetic disorder of the lymphatic system and sudden hormonal changes in women. \n My doctor, Dr. John of the San Francisco General Hospital,  believes that CDT (Complete Decongestive Therapy) and Specialized Liposuction are medically necessary treatments to treat my medical condition and that both these treatments are a covered plan benefit. I have also attached a supporting medical letter that attests that the entire treatment team has recommended that these treatments are medically necessary. Lipoedema occurs because of the abnormal accumulation of fat under the skin.\n As a result of Lipedema, at my current senior age of 66, I suffer from a very poor quality of life and a host of additional complications as a result of Lipedema. As symptoms of untreated Lipedema, I suffer from high swelling and pain in my hips and legs which prevents me from physical exercise. My doctors and I are confident these treatments can greatly improve my condition. If I do not receive this treatment, untreated lipedema can lead to severe lymphedema, which can cause the skin to harden and become discolored. The skin can also become infected and ulcerated. Furthermore, it is already affecting my mental health and going forward can lead to severe mental health disorders. I sincerely request you to reconsider your decision. \n\nThank you for your immediate attention to this matter. \n\nAttached: A letter from Dr. Kerek corroborating the above and supporting my case. \n\nBest,\nJustine Rose\n\n[[Fields]]:\nInsurance Plan: Cigna MD PPO, Reason: self-inflicted, Patient Name: Rachel Morrison, Patient Age: 30, State: NY, Diagnosis Date: December 10, 2018, Treatment Date: June 10, 2019, Condition type: Diabetes, Condition: Diabetes, Supervising Doctor: Dr. Mark Henderson, Hospital: Mount Sinai Hospital, In-network provider: No, Treatment/procedure name: Gastric bypass\n[[Draft of Appeal Letter]]:\nDear Cigna Representative,\nI am writing to appeal Cigna's decision to deny coverage of treatments for Diabetes for me. I was first diagnosed with Diabetes on May 15, 2020. I had visited Dr. John of the Mount Sinai Hospital, which is an in-network treatment provider, and on his strong recommendation commenced Gastric bypass surgery on July 20, 2020.\nIt is my understanding that Cigna is denying coverage on the basis that in the denial letter, the treatments required to treat Diabetes were labelled as self-inflicted. My insurance plan, Cigna MD PPO, covers medically necessary services that are not expressly excluded, which are described in the Evidence of Coverage. Contrary to your letter, Gastric bypass surgery is a covered service. Diabetes is a chronic condition that occurs because of an abnormal metabolism of glucose in the body. According to New York state law,  state’s mandated benefit laws requiring that the health plan provide this coverage, as Diabetes falls under chronic diseases. \nMy doctor, Dr. Henderson of the Mount Sinai Hospital,  believes that Gastric bypass surgery is the medically necessary treatment to treat my medical condition and that both these treatments are a covered plan benefit. I have also attached a supporting medical letter that attests that the entire treatment team has recommended that these treatments are medically necessary. Diabetes occurs because of the abnormal metabolism of glucose in the body. \nAs a result of Diabetes, at my current young age of 30, I suffer from a very poor quality of life and a host of additional complications as a result of Diabetes. As symptoms of untreated Diabetes, I suffer from high blood pressure and high cholesterol. My doctors and I are confident these treatments can greatly improve my condition. If I do not receive this treatment, untreated diabetes can lead to severe heart disease, which can cause heart failure. Other symptoms of untreated long-term diabetes that I'm at a high risk of include nerve damage and loss of vision. For the sake of me and my family, I humbly ask you to reconsider this decision.\n\nThank you for your immediate attention to this matter. \n\nAttached: A letter from Dr. Henderson corroborating the above and supporting my case. \n\nBest,\nRachel Morrison"
    prompt += "[[Fields]]:\n" + text + "\n[[Draft of Appeal Letter]]:"
    # print(prompt)
    response = openai.Completion.create(
        engine="davinci",
        prompt=prompt,
        temperature=0.4,
        max_tokens=601,
        top_p=1,
        frequency_penalty=0.2,
        presence_penalty=0.16,
        stop=["[[Fields]]"],
    )
    return response["choices"][0]["text"]


summarize_GPT = GPT(engine="davinci", temperature=0.5, max_tokens=100)
summarize_GPT.set_premise("This bots answers questions about medical insurance.")
summarize_examples = [
    [
        "Q: What is cancer?",
        "A: Cancer can have many symptoms including fatigue, pain, and tissue masses. Cancer develops when the body's normal control mechanism stops working. There are many kinds of cancer.",
    ],
    [
        "Q: What is diabetes?",
        "A: Diabetes is a disease where your blood sugar levels are too high. With type 1 diabetes, your body does not make insulin, a hormone that helps utilize glucose.",
    ],
    [
        "Q: What is a copay?",
        "A: A copay is a fixed out-of-pocket amount paid by an insured for covered services. A copay is often specified in your insurance policy.",
    ],
]
for example in summarize_examples:
    summarize_GPT.add_example(Example(example[0], example[1]))


@app.route("/summary", methods=["GET", "POST"])
def gpt3():
    prompt = request.data.decode("UTF-8")
    print(prompt)
    out = summarize_GPT.get_top_reply(prompt)
    return out


if __name__ == "__main__":
    app.run(host="0.0.0.0")
