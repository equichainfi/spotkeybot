import re
from colorama import Fore, Style
import time


def loading(file: str, loading_flag: bool) -> str:
    loader: list[str] = ["[⣾]", "[⣷]", "[⣯]", "[⣟]", "[⡿]", "[⢿]", "[⣻]", "[⣽]"]
    i = 0
    while loading_flag == True:
        i = (i + 1) % len(loader)
        print(f"{Fore.GREEN}\r\033[K%s{Style.RESET_ALL} File: path: {file}" % loader[i], flush=True, end="")
        time.sleep(0.1)

"""
[
    {
        file: str,
        lines: list[int],
        pvkeys_found: list[str],
        addresses_found: list[str],
        lines_with_pvkeys: list[int],
        lines_with_addresses: list[int]
    }
]
"""

def process_file(files: list[str]):
    result: dict[str, list[int]] = {}

    for file in files:
        # loading(file, True)

        catched_pv: list[str] = []
        catched_addresses: list[str]=[]
        line_number: list[int] = []

        with open(file=file, mode="r") as file:
            lines: list[str] = file.readlines()
            for line in lines:
                spot_result = spot(line)
                if spot_result and spot_result.startswith("[+] Private Key found"):
                    result.setdefault(file, []).append(lines.index(line))
                    catched_pv.append(line)
                    line_number.append(lines.index(line) + 1)


                elif spot_result and spot_result.startswith("[+] Address found"):
                    result.setdefault(file, []).append(lines.index(line))
                    catched_addresses.append(line)
                    line_number.append(lines.index(line) + 1)
        
        # loading(file, False)
#         print(f"{Fore.RED}[+] Private Keys Catched: {catched_pv}{Style.RESET_ALL}")
#         print(f"{Fore.YELLOW}[+] Line numbers: {line_number.sort()}{Style.RESET_ALL}")
        
    return format_result(result)


def format_result(result: dict[str, list[int]]) -> str:
    result_str: str = ""
    for file in result.keys():
        result_str += f"{Fore.RED}\n[+] File: {file}{Style.RESET_ALL}\n"
        for line_number in result[file]:
            result_str += f"{Fore.YELLOW}[+] Line number: {line_number + 1}{Style.RESET_ALL}\n"

    return result_str

def main(files: list[str]) -> str:
    if not isinstance(files, list):
        raise TypeError(f"[-] Expected list, got {type(files)}")

    return process_file(files)
    


def spot(line: str) -> str | None:
    pvkey_regex: str = r"(^|\b)(0x)?[0-9a-fA-F]{64}(\b|$)"
    addr_regex: str = r"(^|\b)(0x)?[0-9a-fA-F]{40}(\b|$)"
    pgp_regex: str = r"/^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*([a-zA-Z0-9//\n\/\.\:\+\ \=]+).*(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*([a-zA-Z0-9//\n\/\.\:\+\ \=]+).*(-----END PGP PRIVATE KEY BLOCK-----)$/"

    if re.search(pvkey_regex, line):
        return f"[+] Private Key found: {line}"
    elif re.search(addr_regex, line):
        return f"[+] Address found: {line}"
    elif re.search(pgp_regex, line):
        return f"[+] Private Key Block found: {line}"
    else:
        return None


if __name__ == "__main__":
    file_paths: list[str] = [
        "C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/file.txt",
    ]

    print(main(files=file_paths))

