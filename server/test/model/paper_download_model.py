import os
from threading import Thread
from os import path
from server.model import PaperDownload, Paper
from server.test import TemporaryDirectory

PDF_FILE = path.join(path.dirname(__file__), "../../../data/papers/2011_2012_MM120_1_1_2.PDF")
ONLINE_PDF_FILE = "https://www.mis.nuigalway.ie/papers_public/2007_2008/AN/2007_2008_AN101_2_2_3.PDF"

def test_pdf_to_html():
    with TemporaryDirectory() as temp_dir:
        PaperDownload.convert_pdf_to_html(PDF_FILE, output_dir=temp_dir)
        files = [file for file in os.listdir(path.join(temp_dir, path.basename(PDF_FILE.replace(".PDF", ""))))]

        assert "index.html" in files

def test_pdf_download(papers):
    with TemporaryDirectory() as temp_dir:
        paper = papers[0]
        paper.link = ONLINE_PDF_FILE

        # Download the file
        dl = PaperDownload(paper)
        dl.download(temp_dir)

        files = [file for file in os.listdir(path.join(temp_dir, path.basename(ONLINE_PDF_FILE.replace(".PDF", ""))))]

        assert "index.html" in files