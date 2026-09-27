//! Database infrastructure

use crate::config::Config;
use crate::domain::models::User;
use crate::domain::repositories::UserRepository;
use crate::error::Result;
use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite, FromRow};
use std::sync::Arc;
use uuid::Uuid;

#[derive(Clone)]
pub struct Database {
    pool: Pool<Sqlite>,
}

impl Database {
    pub async fn new() -> Result<Self> {
        let config = Config::load().unwrap_or_default();
        let pool = SqlitePoolOptions::new()
            .max_connections(config.database.max_connections)
            .connect(&config.database.url)
            .await?;
        Ok(Self { pool })
    }

    pub fn pool(&self) -> &Pool<Sqlite> {
        &self.pool
    }

    pub async fn migrate(&self) -> Result<()> {
        sqlx::migrate!("./migrations").run(&self.pool).await?;
        Ok(())
    }
}

pub struct SqliteUserRepository {
    pool: Pool<Sqlite>,
}

impl SqliteUserRepository {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self { pool }
    }
}

#[async_trait::async_trait]
impl UserRepository for SqliteUserRepository {
    async fn create(&self, user: crate::domain::models::CreateUser) -> Result<User> {
        let id = Uuid::new_v4();
        let now = chrono::Utc::now();

        sqlx::query!(
            r#"INSERT INTO users (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)"#,
            id,
            user.name,
            now,
            now
        )
        .execute(&self.pool)
        .await?;

        Ok(User { id, name: user.name, created_at: now, updated_at: now })
    }

    async fn get_by_id(&self, id: Uuid) -> Result<Option<User>> {
        let row = sqlx::query_as!(
            User,
            r#"SELECT id, name, created_at, updated_at FROM users WHERE id = ?"#,
            id
        )
        .fetch_optional(&self.pool)
        .await?;
        Ok(row)
    }

    async fn update(&self, id: Uuid, user: crate::domain::models::UpdateUser) -> Result<User> {
        let now = chrono::Utc::now();

        sqlx::query!(
            r#"UPDATE users SET name = COALESCE(?, name), updated_at = ? WHERE id = ?"#,
            user.name,
            now,
            id
        )
        .execute(&self.pool)
        .await?;

        self.get_by_id(id).await?.ok_or_else(|| crate::error::AppError::NotFound("User not found".into()))
    }

    async fn delete(&self, id: Uuid) -> Result<()> {
        sqlx::query!(r#"DELETE FROM users WHERE id = ?"#, id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    async fn list(&self) -> Result<Vec<User>> {
        let rows = sqlx::query_as!(
            User,
            r#"SELECT id, name, created_at, updated_at FROM users ORDER BY created_at DESC"#
        )
        .fetch_all(&self.pool)
        .await?;
        Ok(rows)
    }
}

pub fn create_user_repository(pool: Pool<Sqlite>) -> Arc<dyn UserRepository> {
    Arc::new(SqliteUserRepository::new(pool))
}