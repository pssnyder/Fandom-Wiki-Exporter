
export type ProcessStatus = 'idle' | 'fetching_pages' | 'fetching_content' | 'success' | 'error';

export interface AllPagesApiResponse {
    continue?: {
        apcontinue: string;
        continue: string;
    };
    query: {
        allpages: {
            pageid: number;
            ns: number;
            title: string;
        }[];
    };
}

export interface ParseApiResponse {
    parse: {
        title: string;
        pageid: number;
        text: {
            '*': string;
        };
    };
}
