use serde::Serialize;
use crate::{{entity_name}};

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct {{entity_name}}ViewModel {
    pub order_id: String,
    pub customer_id: String
}

impl From<{{entity_name}}> for {{entity_name}}ViewModel {
    fn from(value: {{entity_name}}) -> Self {
        Self {
            customer_id: value.customer_id,
            order_id: value.order_id
        }
    }
}