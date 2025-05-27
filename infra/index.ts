import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as web from "@pulumi/azure-native/web";
import * as sql from "@pulumi/azure-native/sql";
import * as random from "@pulumi/random";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("resourceGroup", {
    location: "southeastasia",
});

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("sa", {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
});

// Create an App Service Plan
const appServicePlan = new web.AppServicePlan("appserviceplan", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    sku: {
        name: "B1",
        tier: "Basic",
    },
    kind: "Linux",
    reserved: true,
});

// Create a Web App (Frontend)
const webApp = new web.WebApp("webapp", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    serverFarmId: appServicePlan.id,
    siteConfig: {
        linuxFxVersion: "NODE|16-lts",
    },
});

// Create a Web App (Backend)
const backendApp = new web.WebApp("backendapp", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    serverFarmId: appServicePlan.id,
    siteConfig: {
        linuxFxVersion: "NODE|16-lts",
    },
});

// Create a random password for SQL admin
const sqlAdminPassword = new random.RandomPassword("sql-password", {
    length: 16,
    special: true,
    overrideSpecial: "_@%"
});

// Create Azure SQL Server
const sqlServer = new sql.Server("sqlserver", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    administratorLogin: "sqladminuser",
    administratorLoginPassword: sqlAdminPassword.result,
    version: "12.0",
});

// Create DTU-based Azure SQL Database (e.g., S0 tier)
const sqlDatabase = new sql.Database("sqldb", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    serverName: sqlServer.name,
    sku: {
        name: "Basic",
        tier: "Basic",
        capacity: 5,
    },
    maxSizeBytes: 2147483648, // 2 GB
    collation: "SQL_Latin1_General_CP1_CI_AS", // Default collation
});

// Allow Azure services to access the SQL server
const sqlFirewall = new sql.FirewallRule("allow-azure-services", {
    resourceGroupName: resourceGroup.name,
    serverName: sqlServer.name,
    startIpAddress: "0.0.0.0",
    endIpAddress: "0.0.0.0",
});

// Export the primary key of the Storage Account
const storageAccountKeys = storage.listStorageAccountKeysOutput({
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name
});

export const primaryStorageKey = storageAccountKeys.keys[0].value;
export const webAppEndpoint = pulumi.interpolate`https://${webApp.defaultHostName}`;
export const backendAppEndpoint = pulumi.interpolate`https://${backendApp.defaultHostName}`;
export const sqlServerName = sqlServer.name;
export const sqlDatabaseName = sqlDatabase.name;
export const sqlAdminUser = sqlServer.administratorLogin;
export const sqlAdminPasswordOut = sqlAdminPassword.result;
export const sqlServerFqdn = sqlServer.fullyQualifiedDomainName;
