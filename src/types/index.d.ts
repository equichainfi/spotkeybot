export { FindKeyResult, IFiles, MainImplResponse };

declare module "probot" {
    type Response = MainImplResponse[] | string;

    interface AddLabelResponse {
        name: string;
    }

    interface FindKeyResult {
        fileName: string;
        lineContent: string;
        lineNumbers: number[];
        keysFound: string[];
        numberOfKeysFound: number;
    }

    interface IFiles {
        fileName: string;
        fileContent: string;
    }

    interface MainImplResponse {
        fileName: string;
        lineNumbers: number[];
        keysFound: string[];
        linksToLines?: string[] | undefined;
    }

    interface IFileObject {
        filename: string;
        additions: number;
        deletions: number;
        fileData: string | undefined;
    }

    interface IFormatInput {
        found: boolean;
        sender: string;
        res: MainImplResponse[];
        fileBlobs: string[];
    }
    interface IActionMap {
        [key: string]: { add?: string[]; remove?: string[] };
    }
}
