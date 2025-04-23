export function kebabToCamel(str: string) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  export const urlMapping = (slug: string, mappingObject: Record<string, string>) => {
    return mappingObject[slug] || "";
  };

  export const getReadTime = (content: string | null, wpm = 265): number => {
    if (!content) {
      return 0;
    }
  
    return Math.ceil(content.trim().split(/\s+/).length / wpm);
  };

  export const getServerData = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};
  
