declare module 'jsmediatags' {
  export interface PictureTag {
    data: number[];
    format: string;
  }

  export interface Tag {
    tags: {
      title?: string;
      artist?: string;
      album?: string;
      picture?: PictureTag;
    };
  }

  export function read(
    file: File | string,
    callbacks: {
      onSuccess: (tag: Tag) => void;
      onError: (error: any) => void;
    }
  ): void;
}

declare module 'jsmediatags/dist/jsmediatags.min.js' {
  import * as jsmediatags from 'jsmediatags';
  export = jsmediatags;
}