use regex::Regex;
use std::io::{self, BufRead, Write};
use tokio::time::sleep;
use std::time::Duration;

async fn loading(file_path: &str) {
    let loader = ["[⣾]", "[⣷]", "[⣯]", "[⣟]", "[⡿]", "[⢿]", "[⣻]", "[⣽]"];
    let mut i = 0;

    loop {
        i = (i + 1) % loader.len();
        print!("\r\0{} File: path: {}", loader[i], file_path);
        io::stdout().flush().unwrap();
        sleep(Duration::from_millis(100)).await;
    }
}

fn stop_loading() {
    println!(); 
}

fn spot(line: &str) -> Option<String> {
    let pvkey_reg_ex = Regex::new(r"(^|\b)(0x)?[0-9a-fA-F]{64}(\b|$)").unwrap();
    let addr_reg_ex = Regex::new(r"(^|\b)(0x)?[0-9a-fA-F]{40}(\b|$)").unwrap();

    if pvkey_reg_ex.is_match(line) {
        Some(format!("[+] Private Key found: {}", line))
    } else if addr_reg_ex.is_match(line) {
        Some(format!("[+] Address found: {}", line))
    } else {
        None
    }
}

async fn process_file(file_path: &str) {
    if let Ok(file) = std::fs::File::open(file_path) {
        let reader = io::BufReader::new(file);
        for line in reader.lines() {
            if let Some(result) = spot(&line.unwrap()) {
                println!("{}", result);
            }
        }
    }
}

#[tokio::main]
async fn main() {
    let file_paths = vec![
        "C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/eth500.txt",
        "C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/main.ts",
    ];

    for file_path in file_paths {
        let loading_task = tokio::spawn(loading(file_path));
        let processing_task = tokio::spawn(process_file(file_path));

        
        processing_task.await.unwrap();

        
        loading_task.abort();
    }

    stop_loading();
}
