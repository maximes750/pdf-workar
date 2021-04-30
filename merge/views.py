from django.http import HttpResponse
from PyPDF2 import PdfFileMerger, PdfFileReader, PdfFileWriter
from django.shortcuts import render
import io
from django.conf import settings

def merge(request):
    if request.method == 'POST':
        tmp = io.BytesIO()
        files = request.FILES.getlist("files")
        values =request.POST.getlist("values")
        values = [int(i) for i in values]
        typ = request.POST.get("type")
        if typ == 'Normal':
            out = normal_merge(files,values)
        elif typ == "2" or typ == "4":
            out = page_merge(files,int(typ),values)
        response = HttpResponse(out,content_type="application/pdf")
        response['Content-Disposition'] = "attachment; filename=output.pdf"
        return response
    return render(request, 'merge/index.html',settings.SITE_WHOLE_ADDRESS)

def normal_merge(files,values):
    tmp = io.BytesIO()
    mergedObject = PdfFileMerger()
    for i in values:
        mergedObject.append(PdfFileReader(files[i]))
    mergedObject.write(tmp)
    return tmp.getvalue()

def page_merge(files,type,values):
    tmp = io.BytesIO()
    writer = PdfFileWriter()
    for i in values:
        reader = PdfFileReader(files[i])
        for j in range(reader.getNumPages()):
            writer.addPage(reader.getPage(j))
        _, _, w, h = reader.getPage(0)['/MediaBox']
        for j in range((type-reader.getNumPages()%type)%type):
            writer.addBlankPage(w,h)
    writer.write(tmp)
    return tmp.getvalue()