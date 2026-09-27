//! IPC registration

use crate::commands::*;
use tauri::ipc::Command;

pub fn register_commands() -> Vec<Command> {
    vec![
        greet::into(),
        save_user_name::into(),
        get_user::into(),
        update_user::into(),
        delete_user::into(),
        list_users::into(),
        toggle_maximize::into(),
        minimize_window::into(),
        close_window::into(),
        is_maximized::into(),
    ]
}