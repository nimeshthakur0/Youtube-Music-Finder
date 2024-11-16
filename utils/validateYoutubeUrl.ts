
export function validateYoutubeUrl(url: string): string | null {

    const trimmedUrl = url.trim();
    
    const patterns = [
        /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/
    ];

      for (const pattern of patterns){
        const match = trimmedUrl.match(pattern);
        if(match){
            return match[1];
        }
      }
    
    return null;
}