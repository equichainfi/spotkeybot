import re
from colorama import Fore, Style
import time


def loading(file_path: str, loading_flag: bool) -> str:
    loader: list[str] = ["[⣾]", "[⣷]", "[⣯]", "[⣟]", "[⡿]", "[⢿]", "[⣻]", "[⣽]"]
    i = 0
    while loading_flag == True:
        i = (i + 1) % len(loader)
        print(f"{Fore.GREEN}\r\033[K%s{Style.RESET_ALL} File: path: {file_path}" % loader[i], flush=True, end="")
        time.sleep(0.1)


def process_file(file_paths: list[str]):
    result: dict[str, list[int]] = {}

    for file_path in file_paths:
        # loading(file_path, True)

        catched_pv: list[str] = []
        catched_addresses: list[str]=[]
        line_no: list[int] = []
        with open(file=file_path, mode="r") as file:
            lines: list[str] = file.readlines()
            for line in lines:
                spot_result = spot(line)
                if spot_result and spot_result.startswith("[+] Private Key found"):
                    result.setdefault(file_path, []).append(lines.index(line))
                    catched_pv.append(line)
                    line_no.append(lines.index(line) + 1)  
                elif spot_result and spot_result.startswith("[+] Address found"):
                    result.setdefault(file_path, []).append(lines.index(line))
                    catched_addresses.append(line)
                    line_no.append(lines.index(line) + 1)  
        
        # loading(file_path, False)
        print(f"{Fore.RED}[+] Private Keys Catched: {catched_pv}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}[+] Line numbers: {line_no.sort()}{Style.RESET_ALL}")
        
    return f"\n[+] All catches: {result}"


def main(file_paths: list[str]) -> str:
    if not isinstance(file_paths, list):
        raise TypeError(f"[-] Expected list, got {type(file_paths)}")

    return process_file(file_paths)
    


def spot(line: str) -> str | None:
    pvkey_reg_ex: str = r"(^|\b)(0x)?[0-9a-fA-F]{64}(\b|$)"
    addr_reg_ex: str = r"(^|\b)(0x)?[0-9a-fA-F]{40}(\b|$)"

    if re.search(pvkey_reg_ex, line):
        return f"[+] Private Key found: {line}"
    elif re.search(addr_reg_ex, line):
        return f"[+] Address found: {line}"
    else:
        return None


if __name__ == "__main__":
    file_paths: list[str] = [
        "C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/eth500.txt",
        "C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/main.ts",
        # "C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/file.txt",
    ]
    # paths = []
    # no_of_paths = int(input("Enter number of paths: "))
    # for i in range(no_of_paths):
    #     path = str(input("Enter path: "))
    #     while path == "" or type(path) != str:
    #         path = str(input("Enter path: "))


    print(main(file_paths=file_paths))
