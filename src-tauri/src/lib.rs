//! Library entry point

pub mod commands;
pub mod config;
pub mod domain;
pub mod error;
pub mod infrastructure;
pub mod ipc;

pub use error::{AppError, Result};