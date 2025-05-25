import { Injectable } from '@angular/core';
import { read, Tag } from 'jsmediatags';

@Injectable({ providedIn: 'root' })
export class MetadataService {
  extractMetadata(file: File): Promise<Tag['tags']> {
    return new Promise((resolve, reject) => {
      read(file, {
        onSuccess: (tag: Tag) => resolve(tag.tags),
        onError: (error: any) => reject(error)
      });
    });
  }
}
