provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "nextjs-rg"
  location = "East US"
}

resource "azurerm_app_service_plan" "plan" {
  name                = "nextjs-linux-plan"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  kind                = "Linux"
  reserved            = true
  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_app_service" "app" {
  name                = "nextjs-webapp"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  app_service_plan_id = azurerm_app_service_plan.plan.id

  site_config {
    linux_fx_version = "DOCKER|<youracr>.azurecr.io/nextjs-app:latest"
    always_on        = true
    health_check_path = "/api/health"
  }

  app_settings = {
    "DOCKER_REGISTRY_SERVER_URL"      = "https://<youracr>.azurecr.io"
    "DOCKER_REGISTRY_SERVER_USERNAME" = "<youracr-username>"
    "DOCKER_REGISTRY_SERVER_PASSWORD" = "<youracr-password>"
    "WEBSITES_PORT"                   = "3000"
  }
}
