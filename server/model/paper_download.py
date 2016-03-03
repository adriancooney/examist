import os
import re
import datetime
import requests
import subprocess
from os import path
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from server.database import Model
from server.library import Assistant
from server.exc import NotFound

class PaperDownload(Model, Assistant):
    __tablename__ = "paper_download"

    id = Column(Integer, primary_key=True)
    path = Column(String) # The path on the filesystem the paper is downloaded to
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(Enum("unavailable", "pending", "available", name="paper_download_status"), default="pending")
    paper_id = Column(Integer, ForeignKey("paper.id"))
    paper = relationship("Paper", backref=backref("contents", uselist=False))

    def __init__(self, paper):
        self.paper = paper

    def download(self, output_dir):
        """Download the paper the paper to a directory, convert to HTML and delete."""

        if not self.paper.link:
            raise NotFound("Paper file")

        # Fix for SSL error
        link = self.paper.link.replace("https", "http")

        # Get the output path
        pdf_file_path = path.join(output_dir, path.basename(link))

        # Download the file
        PaperDownload.download_file(link, pdf_file_path)

        # Convert the pdf
        PaperDownload.convert_pdf_to_html(pdf_file_path, output_dir)

        # Remove the file
        os.unlink(pdf_file_path)

    @staticmethod
    def download_file(link, file_path):
        """Download a file to a directory."""

        # Download the PDF to a directory
        download = requests.get(link, stream=True, verify=False)

        if download.status_code == 200:
            with open(file_path, "wb") as file_download:
                for chunk in download.iter_content(chunk_size=1024):
                    if chunk:
                        file_download.write(chunk)
        else:
            raise NotFound("Paper File")

    @staticmethod
    def convert_pdf_to_html(file_path, output_dir=None):
        """Convert a PDf to html."""

        if not dir:
            output_dir = path.dirname(file_path)

        # Get the output file name (remove the pdf extension)
        output_file_name = re.sub(r"\.pdf$", "", path.basename(file_path), flags=re.I)

        # Create the content directory
        content_dir = path.join(output_dir, output_file_name)
        os.mkdir(content_dir)

        # Now we use the pdf2html tool to convert the PDF file to HTML
        subprocess.call(["/usr/local/bin/pdftohtml", "-s", "-c", file_path, path.join(content_dir, "index")])

        # For some reason the tool appends "-html" to the filename, we need to remove this
        os.rename(path.join(content_dir, "index-html.html"), path.join(content_dir, "index.html"))
