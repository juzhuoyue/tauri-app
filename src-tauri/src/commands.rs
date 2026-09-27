//! Tauri commands

use crate::domain::services::UserService;
use crate::error::Result;
use tauri::{command, State, Window};
use uuid::Uuid;

#[command]
pub async fn greet(name: &str) -> Result<String> {
    Ok(format!("Hello, {}! Welcome to Tauri App.", name))
}

#[command]
pub async fn save_user_name(name: String, service: State<'_, UserService>) -> Result<()> {
    service.create_user(name).await?;
    Ok(())
}

#[command]
pub async fn get_user(id: Uuid, service: State<'_, UserService>) -> Result<Option<crate::domain::models::User>> {
    service.get_user(id).await
}

#[command]
pub async fn update_user(id: Uuid, name: Option<String>, service: State<'_, UserService>) -> Result<crate::domain::models::User> {
    service.update_user(id, name).await
}

#[command]
pub async fn delete_user(id: Uuid, service: State<'_, UserService>) -> Result<()> {
    service.delete_user(id).await
}

#[command]
pub async fn list_users(service: State<'_, UserService>) -> Result<Vec<crate::domain::models::User>> {
    service.list_users().await
}

#[command]
pub async fn toggle_maximize(window: Window) -> Result<()> {
    if window.is_maximized().unwrap_or(false) {
        window.unmaximize()?;
    } else {
        window.maximize()?;
    }
    window.emit("window-state-changed", !window.is_maximized().unwrap_or(false))?;
    Ok(())
}

#[command]
pub async fn minimize_window(window: Window) -> Result<()> {
    window.minimize()?;
    Ok(())
}

#[command]
pub async fn close_window(window: Window) -> Result<()> {
    window.close()?;
    Ok(())
}

#[command]
pub async fn is_maximized(window: Window) -> Result<bool> {
    Ok(window.is_maximized().unwrap_or(false))
}