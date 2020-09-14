from summarizer import Summarizer

model = Summarizer()


def read_and_summarize(letterpath):
    f = open("../resources/denial_letter.txt", "r")
    body = f.read()
    result = model(body, num_sentences=3)
    return result


letterpath = "../resources/denial_letter.txt"
print(read_and_summarize(letterpath))
