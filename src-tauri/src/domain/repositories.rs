//! Repository traits

use crate::domain::models::{CreateUser, UpdateUser, User};
use crate::error::Result;
use uuid::Uuid;

#[async_trait::async_trait]
pub trait UserRepository: Send + Sync {
    async fn create(&self, user: CreateUser) -> Result<User>;
    async fn get_by_id(&self, id: Uuid) -> Result<Option<User>>;
    async fn update(&self, id: Uuid, user: UpdateUser) -> Result<User>;
    async fn delete(&self, id: Uuid) -> Result<()>;
    async fn list(&self) -> Result<Vec<User>>;
}