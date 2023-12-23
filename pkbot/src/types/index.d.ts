export { FindKeyResult, IFiles, MainImplResponse };

declare module "probot" {
    interface FindKeyResult {
        fileName: string;
        lineContent: string;
        lineNumbers: number[];
        keysFound: string[];
        addressesFound: string[];
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
    }

    interface IFileObject {
        filename: string;
        additions: number;
        deletions: number;
        fileData: string | undefined;
    }

    interface IFormatInput {
        filesArray: IFileObject[];
        found: boolean;
        sender: string;
    }
}
