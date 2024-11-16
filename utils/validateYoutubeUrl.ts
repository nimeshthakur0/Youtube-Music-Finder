
export function validateYoutubeUrl(url: string): string | null {
    
    const patterns = [
        /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/
      ];

      for (const pattern of patterns){
        const match = url.match(pattern);
        if(match){
            return match[1];
        }
      }
    
    return null;
}