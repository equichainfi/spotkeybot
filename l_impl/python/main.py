import re


def main(file_paths: list[str]) -> str:
    if not isinstance(file_paths, list):
        raise TypeError(f"Expected list, got {type(file_paths)}")

    result: dict[str, list[int]] = {}

    for file_path in file_paths:
        print(f"====================== File path: {file_path} ======================")
        catched: list[str] = []
        line_no: list[int] = []
        with open(file=file_path, mode='r') as file:
            lines: list[str] = file.readlines()
            for line in lines:
                spot_result = spot(line)
                if spot_result and spot_result.startswith("PV key found"):
                    result.setdefault(file_path, []).append(lines.index(line))
                    catched.append(line)
                    line_no.append(lines.index(line))

        print(f"Catches: {catched}")
        print(f"Line numbers: {line_no}")
    return f"\nAll catches: {result}"


def spot(line: str) -> str | None:
    pvkey_reg_ex: str = r"(^|\b)(0x)?[0-9a-fA-F]{64}(\b|$)"
    addr_reg_ex: str = r"(^|\b)(0x)?[0-9a-fA-F]{40}(\b|$)"

    if re.search(pvkey_reg_ex, line):
        return f"PV key found: {line}"
    elif re.search(addr_reg_ex, line):
        return f"Address found: {line}"
    else:
        return None


if __name__ == '__main__':
    file_paths: list[str] = [
        "C:/Users/olivi/PycharmProjects/pkbot/l/type.ts",
        "C:/Users/olivi/PycharmProjects/pkbot/l/eth500.txt"
    ]
    result = main(file_paths=file_paths)
    print(result)

# add and fix colors for prints