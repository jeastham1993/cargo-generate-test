use serde::Deserialize;

use crate::{ApplicationError, {{entity_name}}Repository};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Delete{{entity_name}}Command {
    pub customer_id: String,
    pub order_id: String,
}

pub struct Delete{{entity_name}}CommandHandler {
    order_repository: {{entity_name}}Repository
}

impl Delete{{entity_name}}CommandHandler {
    pub fn new(order_repository: {{entity_name}}Repository) -> Self {
        Self {
            order_repository
        }
    }

    pub async fn handle(&self, command: Delete{{entity_name}}Command) -> Result<(), ApplicationError>{
        let order = &self.order_repository.get_by_id(command.customer_id, command.order_id).await?;

        let _ = &self.order_repository.delete(order).await?;

        Ok(())
    }
}