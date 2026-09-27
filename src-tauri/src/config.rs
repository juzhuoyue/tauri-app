//! Configuration

use figment::{Figment, providers::{Toml, Env, Format}};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub database: DatabaseConfig,
    pub app: AppConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub name: String,
    pub version: String,
}

impl Config {
    pub fn load() -> Result<Self, figment::Error> {
        let config_dir = directories::ProjectDirs::from("com", "example", "tauri-app")
            .map(|dirs| dirs.config_dir().to_path_buf())
            .unwrap_or_else(|| PathBuf::from("."));

        Figment::new()
            .merge(Toml::file(config_dir.join("config.toml")))
            .merge(Env::prefixed("TAURI_APP_").global())
            .extract()
    }
}

impl Default for Config {
    fn default() -> Self {
        let data_dir = directories::ProjectDirs::from("com", "example", "tauri-app")
            .map(|dirs| dirs.data_dir().join("app.db"))
            .unwrap_or_else(|| PathBuf::from("app.db"));

        Self {
            database: DatabaseConfig {
                url: format!("sqlite:{}", data_dir.display()),
                max_connections: 5,
            },
            app: AppConfig {
                name: "Tauri App".into(),
                version: env!("CARGO_PKG_VERSION").into(),
            },
        }
    }
}