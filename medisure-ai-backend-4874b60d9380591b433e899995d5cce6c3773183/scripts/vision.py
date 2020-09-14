import os
import secrets
from dotenv import load_dotenv, find_dotenv

from google.cloud import storage
from google.cloud import documentai_v1beta2 as documentai


load_dotenv(find_dotenv(), override=True)
PROJECT_ID = os.getenv("GOOGLE_PROJECT_ID", "")
BUCKET_URL = os.getenv("GOOGLE_BUCKET_URL", "")
BUCKET_NAME = os.getenv("GOOGLE_BUCKET_NAME", "")

storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)


def parse_table(filename, condense=False):
    input_uri = secrets.token_hex(nbytes=16)
    blob = bucket.blob(input_uri)
    blob.upload_from_filename(filename)

    client = documentai.DocumentUnderstandingServiceClient()
    gcs_source = documentai.types.GcsSource(uri=BUCKET_URL + input_uri)

    input_config = documentai.types.InputConfig(
        gcs_source=gcs_source, mime_type="application/pdf"
    )

    table_bound_hints = [
        documentai.types.TableBoundHint(
            page_number=1,
            bounding_box=documentai.types.BoundingPoly(
                normalized_vertices=[
                    documentai.types.geometry.NormalizedVertex(x=0, y=0),
                    documentai.types.geometry.NormalizedVertex(x=1, y=0),
                    documentai.types.geometry.NormalizedVertex(x=1, y=1),
                    documentai.types.geometry.NormalizedVertex(x=0, y=1),
                ]
            ),
        )
    ]

    # Setting enabled=True enables form extraction
    table_extraction_params = documentai.types.TableExtractionParams(
        enabled=True, table_bound_hints=table_bound_hints
    )

    parent = "projects/{}/locations/us".format(PROJECT_ID)
    request = documentai.types.ProcessDocumentRequest(
        parent=parent,
        input_config=input_config,
        table_extraction_params=table_extraction_params,
    )

    document = client.process_document(request=request)

    def _get_text(el):
        response = ""
        for segment in el.text_anchor.text_segments:
            start_index = segment.start_index
            end_index = segment.end_index
            response += document.text[start_index:end_index]
        for char in ["\n", "\t", "•", ":"]:
            response = response.replace(char, " ")
        while "  " in char:
            response = response.replace("  ", " ")
        return response.strip()

    out = []
    for page in document.pages:
        for table_num, table in enumerate(page.tables):
            for row_num, row in enumerate(table.header_rows):
                out.append("|".join([_get_text(cell.layout) for cell in row.cells]))
            for row_num, row in enumerate(table.body_rows):
                out.append("|".join([_get_text(cell.layout) for cell in row.cells]))
            out.append("")
    data = "\n".join(out)[:6000]

    if len(data) < 1000:
        data = document.text

    if condense:
        data = summarize(data)

    out_uri = secrets.token_hex(nbytes=16)
    blob = bucket.blob(out_uri)
    blob.upload_from_string(data)
    return out_uri, data


def summarize(text):
    from summa import summarizer

    summarizer.percentage = 0.9
    return summarizer.summarize(text)
