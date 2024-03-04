// Copyright 2023 RISC Zero, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use std::io::Read;

use alloy_primitives::U256;
use alloy_sol_types::SolValue;
use risc0_zkvm::guest::env;
// use std::error::Error;
// use serde::Deserialize;

// use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE, USER_AGENT};

// #[derive(Deserialize, Debug)]
// struct Karma {
//     comment_karma: i32,
//     link_karma: i32,
// }

// #[derive(Deserialize, Debug)]
// struct KarmaList {
//     data: Vec<Karma>,
// }

// fn get_user_karma(access_token: &str) -> Result<u32, Box<dyn Error>> {
//     let mut headers = HeaderMap::new();
//     headers.insert(AUTHORIZATION, HeaderValue::from_str(&format!("Bearer {}", access_token))?);
//     headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
//     headers.insert(USER_AGENT, HeaderValue::from_static("aroralanuk"));

//     let client = reqwest::blocking::Client::new();
//     let res = client.get("https://oauth.reddit.com/api/v1/me/karma")
//         .headers(headers)
//         .send()
//         .await?;

//     let data: KarmaList = res.json().await?;
//     let total_karma: u32 = data.data.iter()
//     .fold(0i32, |total, karma| total + karma.comment_karma + karma.link_karma)
//     .max(0) as u32;

//     Ok(total_karma)
// }


fn main() {
    // Read the input data for this application.
    let mut input_bytes = Vec::<u8>::new();
    env::stdin().read_to_end(&mut input_bytes).unwrap();
    // // Decode and parse the input
    let number = <U256>::abi_decode(&input_bytes, true).unwrap();

    // let _ = get_user_karma("<INSERT_ACCESS_TOKEN>");

    // Run the computation.
    // In this case, asserting that the provided number is even.
    assert!(number.bit(0) == false, "number is not even");

    // // Commit the journal that will be received by the application contract.
    // // Journal is encoded using Solidity ABI for easy decoding in the app contract.
    env::commit_slice(number.abi_encode().as_slice());
}
