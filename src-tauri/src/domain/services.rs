//! Domain services

use crate::domain::models::{CreateUser, UpdateUser, User};
use crate::domain::repositories::UserRepository;
use crate::error::Result;
use std::sync::Arc;
use uuid::Uuid;

pub struct UserService {
    repo: Arc<dyn UserRepository>,
}

impl UserService {
    pub fn new(repo: Arc<dyn UserRepository>) -> Self {
        Self { repo }
    }

    pub async fn create_user(&self, name: String) -> Result<User> {
        if name.trim().is_empty() {
            return Err(crate::error::AppError::Validation("Name cannot be empty".into()));
        }
        self.repo.create(CreateUser { name: name.trim().to_string() }).await
    }

    pub async fn get_user(&self, id: Uuid) -> Result<Option<User>> {
        self.repo.get_by_id(id).await
    }

    pub async fn update_user(&self, id: Uuid, name: Option<String>) -> Result<User> {
        if let Some(ref n) = name {
            if n.trim().is_empty() {
                return Err(crate::error::AppError::Validation("Name cannot be empty".into()));
            }
        }
        self.repo.update(id, UpdateUser { name: name.map(|n| n.trim().to_string()) }).await
    }

    pub async fn delete_user(&self, id: Uuid) -> Result<()> {
        self.repo.delete(id).await
    }

    pub async fn list_users(&self) -> Result<Vec<User>> {
        self.repo.list().await
    }
}