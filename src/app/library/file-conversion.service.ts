import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileConversionService {

  constructor(private client: HttpClient) { }

  convertOdtFile(buffer: ArrayBuffer, filename: String) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream' }),
      responseType: "blob" as "text"
    }
    
    this.client.post("/v2/convert/odt", buffer, httpOptions).subscribe((blob => {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      let name = filename.replace('.odt', '.md');
      a.download = name;
      a.dispatchEvent(new MouseEvent('click'));
    }));
  }
}
