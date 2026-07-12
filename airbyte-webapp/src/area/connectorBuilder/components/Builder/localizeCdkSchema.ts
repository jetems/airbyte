/**
 * JETEMS: CDK declarative schema title/description 中文覆盖。
 * 不修改 declarative_component_schema.yaml（由 CDK 版本拉取），不影响 schema 功能与校验。
 * 本文件可由 tools/jetems-gen-cdk-schema-zh.py 重新生成。
 */
import { IntlShape } from "react-intl";

const CDK_TITLE_MESSAGE_IDS: Record<string, string> = {
  "API Base URL": "connectorBuilder.cdkSchema.t.API_Base_URL",
  "API Endpoint URL": "connectorBuilder.cdkSchema.t.API_Endpoint_URL",
  "API Key": "connectorBuilder.cdkSchema.t.API_Key",
  "API Key Authenticator": "connectorBuilder.cdkSchema.t.API_Key_Authenticator",
  "API Retention Period": "connectorBuilder.cdkSchema.t.API_Retention_Period",
  "API Token Template": "connectorBuilder.cdkSchema.t.API_Token_Template",
  "Access Token Property Name": "connectorBuilder.cdkSchema.t.Access_Token_Property_Name",
  "Access Token Value": "connectorBuilder.cdkSchema.t.Access_Token_Value",
  Action: "connectorBuilder.cdkSchema.t.Action",
  "Add Fields": "connectorBuilder.cdkSchema.t.Add_Fields",
  "Additional JWT Headers": "connectorBuilder.cdkSchema.t.Additional_JWT_Headers",
  "Additional JWT Payload Properties": "connectorBuilder.cdkSchema.t.Additional_JWT_Payload_Properties",
  Advanced: "connectorBuilder.cdkSchema.t.Advanced",
  "Advanced Auth": "connectorBuilder.cdkSchema.t.Advanced_Auth",
  Algorithm: "connectorBuilder.cdkSchema.t.Algorithm",
  "Allow Catalog Defined Cursor Field": "connectorBuilder.cdkSchema.t.Allow_Catalog_Defined_Cursor_Field",
  "Always Include Properties": "connectorBuilder.cdkSchema.t.Always_Include_Properties",
  "Asynchronous Retriever": "connectorBuilder.cdkSchema.t.Asynchronous_Retriever",
  "Auth flow": "connectorBuilder.cdkSchema.t.Auth_flow",
  "Auth flow type": "connectorBuilder.cdkSchema.t.Auth_flow_type",
  Authenticator: "connectorBuilder.cdkSchema.t.Authenticator",
  "Authenticator Selection Path": "connectorBuilder.cdkSchema.t.Authenticator_Selection_Path",
  Authenticators: "connectorBuilder.cdkSchema.t.Authenticators",
  "Backoff Strategies": "connectorBuilder.cdkSchema.t.Backoff_Strategies",
  "Backoff Time": "connectorBuilder.cdkSchema.t.Backoff_Time",
  "Base JSON Schema": "connectorBuilder.cdkSchema.t.Base_JSON_Schema",
  "Base64-encode Secret Key": "connectorBuilder.cdkSchema.t.Base64_encode_Secret_Key",
  "Basic HTTP Authenticator": "connectorBuilder.cdkSchema.t.Basic_HTTP_Authenticator",
  "Bearer Authenticator": "connectorBuilder.cdkSchema.t.Bearer_Authenticator",
  "Bearer Token": "connectorBuilder.cdkSchema.t.Bearer_Token",
  "Bearer Token Authenticator": "connectorBuilder.cdkSchema.t.Bearer_Token_Authenticator",
  "Block Simultaneous Syncs Action": "connectorBuilder.cdkSchema.t.Block_Simultaneous_Syncs_Action",
  CSV: "connectorBuilder.cdkSchema.t.CSV",
  "CSV To File Extractor": "connectorBuilder.cdkSchema.t.CSV_To_File_Extractor",
  "Call Limit": "connectorBuilder.cdkSchema.t.Call_Limit",
  "Class Name": "connectorBuilder.cdkSchema.t.Class_Name",
  "Client ID": "connectorBuilder.cdkSchema.t.Client_ID",
  "Client ID Property Name": "connectorBuilder.cdkSchema.t.Client_ID_Property_Name",
  "Client Secret": "connectorBuilder.cdkSchema.t.Client_Secret",
  "Client Secret Property Name": "connectorBuilder.cdkSchema.t.Client_Secret_Property_Name",
  "Client-side Incremental Filtering": "connectorBuilder.cdkSchema.t.Client_side_Incremental_Filtering",
  "Component Mapping Definition": "connectorBuilder.cdkSchema.t.Component_Mapping_Definition",
  "Components Resolver": "connectorBuilder.cdkSchema.t.Components_Resolver",
  "Composite Error Handler": "connectorBuilder.cdkSchema.t.Composite_Error_Handler",
  "Composite Key": "connectorBuilder.cdkSchema.t.Composite_Key",
  "Composite Key of Nested Fields": "connectorBuilder.cdkSchema.t.Composite_Key_of_Nested_Fields",
  "Concurrency Level": "connectorBuilder.cdkSchema.t.Concurrency_Level",
  Condition: "connectorBuilder.cdkSchema.t.Condition",
  "Conditional Streams": "connectorBuilder.cdkSchema.t.Conditional_Streams",
  "Config Add Fields": "connectorBuilder.cdkSchema.t.Config_Add_Fields",
  "Config Components Resolver": "connectorBuilder.cdkSchema.t.Config_Components_Resolver",
  "Config Migration": "connectorBuilder.cdkSchema.t.Config_Migration",
  "Config Normalization Rules": "connectorBuilder.cdkSchema.t.Config_Normalization_Rules",
  "Config Remove Fields": "connectorBuilder.cdkSchema.t.Config_Remove_Fields",
  "Configs Pointer": "connectorBuilder.cdkSchema.t.Configs_Pointer",
  "Connection Specification": "connectorBuilder.cdkSchema.t.Connection_Specification",
  "Constant Backoff": "connectorBuilder.cdkSchema.t.Constant_Backoff",
  "Create or Update": "connectorBuilder.cdkSchema.t.Create_or_Update",
  "Current Parent Key Value Identifier": "connectorBuilder.cdkSchema.t.Current_Parent_Key_Value_Identifier",
  "Current Partition Value Identifier": "connectorBuilder.cdkSchema.t.Current_Partition_Value_Identifier",
  "Cursor Datetime Formats": "connectorBuilder.cdkSchema.t.Cursor_Datetime_Formats",
  "Cursor Field": "connectorBuilder.cdkSchema.t.Cursor_Field",
  "Cursor Granularity": "connectorBuilder.cdkSchema.t.Cursor_Granularity",
  "Cursor Pagination": "connectorBuilder.cdkSchema.t.Cursor_Pagination",
  "Cursor Value": "connectorBuilder.cdkSchema.t.Cursor_Value",
  "Custom Authenticator": "connectorBuilder.cdkSchema.t.Custom_Authenticator",
  "Custom Backoff Strategy": "connectorBuilder.cdkSchema.t.Custom_Backoff_Strategy",
  "Custom Config Transformation": "connectorBuilder.cdkSchema.t.Custom_Config_Transformation",
  "Custom Decoder": "connectorBuilder.cdkSchema.t.Custom_Decoder",
  "Custom Error Handler": "connectorBuilder.cdkSchema.t.Custom_Error_Handler",
  "Custom Pagination Strategy": "connectorBuilder.cdkSchema.t.Custom_Pagination_Strategy",
  "Custom Partition Router": "connectorBuilder.cdkSchema.t.Custom_Partition_Router",
  "Custom Record Extractor": "connectorBuilder.cdkSchema.t.Custom_Record_Extractor",
  "Custom Record Filter": "connectorBuilder.cdkSchema.t.Custom_Record_Filter",
  "Custom Requester": "connectorBuilder.cdkSchema.t.Custom_Requester",
  "Custom Retriever": "connectorBuilder.cdkSchema.t.Custom_Retriever",
  "Custom Schema Loader": "connectorBuilder.cdkSchema.t.Custom_Schema_Loader",
  "Custom Schema Normalization": "connectorBuilder.cdkSchema.t.Custom_Schema_Normalization",
  "Custom State Migration": "connectorBuilder.cdkSchema.t.Custom_State_Migration",
  "Custom Transformation": "connectorBuilder.cdkSchema.t.Custom_Transformation",
  "Custom Validation Strategy": "connectorBuilder.cdkSchema.t.Custom_Validation_Strategy",
  "Data Feed API": "connectorBuilder.cdkSchema.t.Data_Feed_API",
  "Data Request Authentication": "connectorBuilder.cdkSchema.t.Data_Request_Authentication",
  "Date Range Clamping": "connectorBuilder.cdkSchema.t.Date_Range_Clamping",
  Datetime: "connectorBuilder.cdkSchema.t.Datetime",
  "Datetime Based Cursor": "connectorBuilder.cdkSchema.t.Datetime_Based_Cursor",
  "Datetime Format": "connectorBuilder.cdkSchema.t.Datetime_Format",
  "Declarative Stream": "connectorBuilder.cdkSchema.t.Declarative_Stream",
  "DeclarativeOAuth Connector Specification": "connectorBuilder.cdkSchema.t.DeclarativeOAuth_Connector_Specification",
  Decoder: "connectorBuilder.cdkSchema.t.Decoder",
  "Deduplicate Partitions": "connectorBuilder.cdkSchema.t.Deduplicate_Partitions",
  "Default Concurrency": "connectorBuilder.cdkSchema.t.Default_Concurrency",
  "Default Error Handler": "connectorBuilder.cdkSchema.t.Default_Error_Handler",
  "Default Paginator": "connectorBuilder.cdkSchema.t.Default_Paginator",
  "Default Values": "connectorBuilder.cdkSchema.t.Default_Values",
  "Definition Of Field To Add": "connectorBuilder.cdkSchema.t.Definition_Of_Field_To_Add",
  "Delete Origin Value": "connectorBuilder.cdkSchema.t.Delete_Origin_Value",
  "Documentation URL": "connectorBuilder.cdkSchema.t.Documentation_URL",
  "Download HTTP Response Format": "connectorBuilder.cdkSchema.t.Download_HTTP_Response_Format",
  "Dpath Extractor": "connectorBuilder.cdkSchema.t.Dpath_Extractor",
  "Dpath Flatten Fields": "connectorBuilder.cdkSchema.t.Dpath_Flatten_Fields",
  "Dpath Validator": "connectorBuilder.cdkSchema.t.Dpath_Validator",
  "Dynamic Schema Loader": "connectorBuilder.cdkSchema.t.Dynamic_Schema_Loader",
  "Dynamic Stream Name": "connectorBuilder.cdkSchema.t.Dynamic_Stream_Name",
  "Dynamic Streams Check Configs": "connectorBuilder.cdkSchema.t.Dynamic_Streams_Check_Configs",
  "Dynamic Streams to Check": "connectorBuilder.cdkSchema.t.Dynamic_Streams_to_Check",
  "End Datetime": "connectorBuilder.cdkSchema.t.End_Datetime",
  "Error Handler": "connectorBuilder.cdkSchema.t.Error_Handler",
  "Error Handlers": "connectorBuilder.cdkSchema.t.Error_Handlers",
  "Error Message": "connectorBuilder.cdkSchema.t.Error_Message",
  "Error Message Substring": "connectorBuilder.cdkSchema.t.Error_Message_Substring",
  "Expand Records From Field": "connectorBuilder.cdkSchema.t.Expand_Records_From_Field",
  "Expiration Duration": "connectorBuilder.cdkSchema.t.Expiration_Duration",
  "Exponential Backoff": "connectorBuilder.cdkSchema.t.Exponential_Backoff",
  "Extra Fields": "connectorBuilder.cdkSchema.t.Extra_Fields",
  "Extraction Regex": "connectorBuilder.cdkSchema.t.Extraction_Regex",
  Extractor: "connectorBuilder.cdkSchema.t.Extractor",
  Factor: "connectorBuilder.cdkSchema.t.Factor",
  "Failure Type": "connectorBuilder.cdkSchema.t.Failure_Type",
  "Fetch Properties from Endpoint": "connectorBuilder.cdkSchema.t.Fetch_Properties_from_Endpoint",
  "Field Name": "connectorBuilder.cdkSchema.t.Field_Name",
  "Field Path": "connectorBuilder.cdkSchema.t.Field_Path",
  "Field Paths": "connectorBuilder.cdkSchema.t.Field_Paths",
  "Field Pointers": "connectorBuilder.cdkSchema.t.Field_Pointers",
  Fields: "connectorBuilder.cdkSchema.t.Fields",
  "File Path": "connectorBuilder.cdkSchema.t.File_Path",
  "File Uploader": "connectorBuilder.cdkSchema.t.File_Uploader",
  "Fixed Window Call Rate Policy": "connectorBuilder.cdkSchema.t.Fixed_Window_Call_Rate_Policy",
  "Flatten Fields": "connectorBuilder.cdkSchema.t.Flatten_Fields",
  "Flatten Lists": "connectorBuilder.cdkSchema.t.Flatten_Lists",
  "Full Refresh Stream": "connectorBuilder.cdkSchema.t.Full_Refresh_Stream",
  "Global Substream Cursor": "connectorBuilder.cdkSchema.t.Global_Substream_Cursor",
  "Grant Type": "connectorBuilder.cdkSchema.t.Grant_Type",
  "Grant Type Property Name": "connectorBuilder.cdkSchema.t.Grant_Type_Property_Name",
  "GraphQL Body": "connectorBuilder.cdkSchema.t.GraphQL_Body",
  "GraphQL Query Body": "connectorBuilder.cdkSchema.t.GraphQL_Query_Body",
  "Group Size": "connectorBuilder.cdkSchema.t.Group_Size",
  "Group by Key": "connectorBuilder.cdkSchema.t.Group_by_Key",
  "Grouping Partition Router": "connectorBuilder.cdkSchema.t.Grouping_Partition_Router",
  "HTTP API Budget": "connectorBuilder.cdkSchema.t.HTTP_API_Budget",
  "HTTP Codes": "connectorBuilder.cdkSchema.t.HTTP_Codes",
  "HTTP Method": "connectorBuilder.cdkSchema.t.HTTP_Method",
  "HTTP Request Matcher": "connectorBuilder.cdkSchema.t.HTTP_Request_Matcher",
  "HTTP Requester": "connectorBuilder.cdkSchema.t.HTTP_Requester",
  "HTTP Response Format": "connectorBuilder.cdkSchema.t.HTTP_Response_Format",
  "Header Name": "connectorBuilder.cdkSchema.t.Header_Name",
  "Header Prefix": "connectorBuilder.cdkSchema.t.Header_Prefix",
  Headers: "connectorBuilder.cdkSchema.t.Headers",
  "Http Components Resolver": "connectorBuilder.cdkSchema.t.Http_Components_Resolver",
  "Incremental Dependency": "connectorBuilder.cdkSchema.t.Incremental_Dependency",
  "Incremental Stream": "connectorBuilder.cdkSchema.t.Incremental_Stream",
  "Incremental Sync": "connectorBuilder.cdkSchema.t.Incremental_Sync",
  "Incrementing Count Cursor": "connectorBuilder.cdkSchema.t.Incrementing_Count_Cursor",
  "Inject API Key Into Outgoing HTTP Request": "connectorBuilder.cdkSchema.t.Inject_API_Key_Into_Outgoing_HTTP_Request",
  "Inject End Time Into Outgoing HTTP Request":
    "connectorBuilder.cdkSchema.t.Inject_End_Time_Into_Outgoing_HTTP_Request",
  "Inject Into": "connectorBuilder.cdkSchema.t.Inject_Into",
  "Inject Offset on First Request": "connectorBuilder.cdkSchema.t.Inject_Offset_on_First_Request",
  "Inject Page Number on First Request": "connectorBuilder.cdkSchema.t.Inject_Page_Number_on_First_Request",
  "Inject Page Size Into Outgoing HTTP Request":
    "connectorBuilder.cdkSchema.t.Inject_Page_Size_Into_Outgoing_HTTP_Request",
  "Inject Page Token Into Outgoing HTTP Request":
    "connectorBuilder.cdkSchema.t.Inject_Page_Token_Into_Outgoing_HTTP_Request",
  "Inject Partition Value Into Outgoing HTTP Request":
    "connectorBuilder.cdkSchema.t.Inject_Partition_Value_Into_Outgoing_HTTP_Request",
  "Inject Start Time Into Outgoing HTTP Request":
    "connectorBuilder.cdkSchema.t.Inject_Start_Time_Into_Outgoing_HTTP_Request",
  "Inject Start Value Into Outgoing HTTP Request":
    "connectorBuilder.cdkSchema.t.Inject_Start_Value_Into_Outgoing_HTTP_Request",
  "Inline Schema Loader": "connectorBuilder.cdkSchema.t.Inline_Schema_Loader",
  "Interpolated Value": "connectorBuilder.cdkSchema.t.Interpolated_Value",
  Interval: "connectorBuilder.cdkSchema.t.Interval",
  Iterable: "connectorBuilder.cdkSchema.t.Iterable",
  JSON: "connectorBuilder.cdkSchema.t.JSON",
  "JSON Lines": "connectorBuilder.cdkSchema.t.JSON_Lines",
  "JWT Authenticator": "connectorBuilder.cdkSchema.t.JWT_Authenticator",
  "JWT Headers": "connectorBuilder.cdkSchema.t.JWT_Headers",
  "JWT Payload": "connectorBuilder.cdkSchema.t.JWT_Payload",
  "Json File Schema Loader": "connectorBuilder.cdkSchema.t.Json_File_Schema_Loader",
  "Json Object Body": "connectorBuilder.cdkSchema.t.Json_Object_Body",
  "Json Schema Property Selector": "connectorBuilder.cdkSchema.t.Json_Schema_Property_Selector",
  Key: "connectorBuilder.cdkSchema.t.Key",
  "Key Path": "connectorBuilder.cdkSchema.t.Key_Path",
  "Key Prefix": "connectorBuilder.cdkSchema.t.Key_Prefix",
  "Key Suffix": "connectorBuilder.cdkSchema.t.Key_Suffix",
  "Key to Snake Case": "connectorBuilder.cdkSchema.t.Key_to_Snake_Case",
  "Key transformation": "connectorBuilder.cdkSchema.t.Key_transformation",
  "Key/Value Pairs": "connectorBuilder.cdkSchema.t.Key_Value_Pairs",
  "Keys Replace": "connectorBuilder.cdkSchema.t.Keys_Replace",
  "Keys to Lower Case": "connectorBuilder.cdkSchema.t.Keys_to_Lower_Case",
  "Lazy Read Pointer": "connectorBuilder.cdkSchema.t.Lazy_Read_Pointer",
  "Legacy To Per-partition-state Migration": "connectorBuilder.cdkSchema.t.Legacy_To_Per_partition_state_Migration",
  Limit: "connectorBuilder.cdkSchema.t.Limit",
  "List Partition Router": "connectorBuilder.cdkSchema.t.List_Partition_Router",
  "Login Path": "connectorBuilder.cdkSchema.t.Login_Path",
  "Login Requester": "connectorBuilder.cdkSchema.t.Login_Requester",
  "Lookback Window": "connectorBuilder.cdkSchema.t.Lookback_Window",
  Matchers: "connectorBuilder.cdkSchema.t.Matchers",
  "Max Concurrency": "connectorBuilder.cdkSchema.t.Max_Concurrency",
  "Max Datetime": "connectorBuilder.cdkSchema.t.Max_Datetime",
  "Max Retry Count": "connectorBuilder.cdkSchema.t.Max_Retry_Count",
  "Max Waiting Time in Seconds": "connectorBuilder.cdkSchema.t.Max_Waiting_Time_in_Seconds",
  Method: "connectorBuilder.cdkSchema.t.Method",
  "Min Datetime": "connectorBuilder.cdkSchema.t.Min_Datetime",
  "Min-Max Datetime": "connectorBuilder.cdkSchema.t.Min_Max_Datetime",
  "Minimum Wait Time": "connectorBuilder.cdkSchema.t.Minimum_Wait_Time",
  "Moving Window Call Rate Policy": "connectorBuilder.cdkSchema.t.Moving_Window_Call_Rate_Policy",
  "Multiple Partition Routers": "connectorBuilder.cdkSchema.t.Multiple_Partition_Routers",
  "Multiple Schema Loaders": "connectorBuilder.cdkSchema.t.Multiple_Schema_Loaders",
  Name: "connectorBuilder.cdkSchema.t.Name",
  "New value": "connectorBuilder.cdkSchema.t.New_value",
  "No Authentication": "connectorBuilder.cdkSchema.t.No_Authentication",
  "No Pagination": "connectorBuilder.cdkSchema.t.No_Pagination",
  "Number of Records": "connectorBuilder.cdkSchema.t.Number_of_Records",
  "Number of seconds": "connectorBuilder.cdkSchema.t.Number_of_seconds",
  "OAuth Config Specification": "connectorBuilder.cdkSchema.t.OAuth_Config_Specification",
  "OAuth input specification": "connectorBuilder.cdkSchema.t.OAuth_input_specification",
  "OAuth output specification": "connectorBuilder.cdkSchema.t.OAuth_output_specification",
  "OAuth server output specification": "connectorBuilder.cdkSchema.t.OAuth_server_output_specification",
  "OAuth user input": "connectorBuilder.cdkSchema.t.OAuth_user_input",
  OAuth2: "connectorBuilder.cdkSchema.t.OAuth2",
  "Offset Increment": "connectorBuilder.cdkSchema.t.Offset_Increment",
  "Old value": "connectorBuilder.cdkSchema.t.Old_value",
  "On No Records": "connectorBuilder.cdkSchema.t.On_No_Records",
  "Outgoing Datetime Format": "connectorBuilder.cdkSchema.t.Outgoing_Datetime_Format",
  "Page Increment": "connectorBuilder.cdkSchema.t.Page_Increment",
  "Page Size": "connectorBuilder.cdkSchema.t.Page_Size",
  "Pagination Reset": "connectorBuilder.cdkSchema.t.Pagination_Reset",
  "Pagination Reset Limits": "connectorBuilder.cdkSchema.t.Pagination_Reset_Limits",
  "Pagination Strategy": "connectorBuilder.cdkSchema.t.Pagination_Strategy",
  Parameters: "connectorBuilder.cdkSchema.t.Parameters",
  "Parametrized Components Resolver": "connectorBuilder.cdkSchema.t.Parametrized_Components_Resolver",
  "Parent Key": "connectorBuilder.cdkSchema.t.Parent_Key",
  "Parent Stream": "connectorBuilder.cdkSchema.t.Parent_Stream",
  "Parent Stream Config": "connectorBuilder.cdkSchema.t.Parent_Stream_Config",
  "Parent Stream Configs": "connectorBuilder.cdkSchema.t.Parent_Stream_Configs",
  Parser: "connectorBuilder.cdkSchema.t.Parser",
  "Partition Field End": "connectorBuilder.cdkSchema.t.Partition_Field_End",
  "Partition Field Start": "connectorBuilder.cdkSchema.t.Partition_Field_Start",
  "Partition Router": "connectorBuilder.cdkSchema.t.Partition_Router",
  "Partition Values": "connectorBuilder.cdkSchema.t.Partition_Values",
  Passphrase: "connectorBuilder.cdkSchema.t.Passphrase",
  Password: "connectorBuilder.cdkSchema.t.Password",
  Path: "connectorBuilder.cdkSchema.t.Path",
  Period: "connectorBuilder.cdkSchema.t.Period",
  "Plain-text Body": "connectorBuilder.cdkSchema.t.Plain_text_Body",
  Policies: "connectorBuilder.cdkSchema.t.Policies",
  Predicate: "connectorBuilder.cdkSchema.t.Predicate",
  "Predicate Validator": "connectorBuilder.cdkSchema.t.Predicate_Validator",
  "Predicate key": "connectorBuilder.cdkSchema.t.Predicate_key",
  "Predicate value": "connectorBuilder.cdkSchema.t.Predicate_value",
  "Primary Key": "connectorBuilder.cdkSchema.t.Primary_Key",
  "Profile Assertion": "connectorBuilder.cdkSchema.t.Profile_Assertion",
  "Properties from Endpoint": "connectorBuilder.cdkSchema.t.Properties_from_Endpoint",
  "Property Chunking": "connectorBuilder.cdkSchema.t.Property_Chunking",
  "Property Limit": "connectorBuilder.cdkSchema.t.Property_Limit",
  "Property Limit Type": "connectorBuilder.cdkSchema.t.Property_Limit_Type",
  "Property List": "connectorBuilder.cdkSchema.t.Property_List",
  "Property Selector": "connectorBuilder.cdkSchema.t.Property_Selector",
  "Query Parameters": "connectorBuilder.cdkSchema.t.Query_Parameters",
  "Query Properties": "connectorBuilder.cdkSchema.t.Query_Properties",
  Rate: "connectorBuilder.cdkSchema.t.Rate",
  "Rate Limit Remaining Header": "connectorBuilder.cdkSchema.t.Rate_Limit_Remaining_Header",
  "Rate Limit Reset Header": "connectorBuilder.cdkSchema.t.Rate_Limit_Reset_Header",
  Rates: "connectorBuilder.cdkSchema.t.Rates",
  "Record Expander": "connectorBuilder.cdkSchema.t.Record_Expander",
  "Record Filter": "connectorBuilder.cdkSchema.t.Record_Filter",
  "Record Merge Strategy": "connectorBuilder.cdkSchema.t.Record_Merge_Strategy",
  "Record Selector": "connectorBuilder.cdkSchema.t.Record_Selector",
  "Refresh Request Body": "connectorBuilder.cdkSchema.t.Refresh_Request_Body",
  "Refresh Request Headers": "connectorBuilder.cdkSchema.t.Refresh_Request_Headers",
  "Refresh Token": "connectorBuilder.cdkSchema.t.Refresh_Token",
  "Refresh Token Error Key": "connectorBuilder.cdkSchema.t.Refresh_Token_Error_Key",
  "Refresh Token Error Status Codes": "connectorBuilder.cdkSchema.t.Refresh_Token_Error_Status_Codes",
  "Refresh Token Error Values": "connectorBuilder.cdkSchema.t.Refresh_Token_Error_Values",
  "Refresh Token Property Name": "connectorBuilder.cdkSchema.t.Refresh_Token_Property_Name",
  "Refresh Token Updater": "connectorBuilder.cdkSchema.t.Refresh_Token_Updater",
  "Remain Original Record": "connectorBuilder.cdkSchema.t.Remain_Original_Record",
  "Remap Field": "connectorBuilder.cdkSchema.t.Remap_Field",
  "Remove Fields": "connectorBuilder.cdkSchema.t.Remove_Fields",
  "Replace Origin Record": "connectorBuilder.cdkSchema.t.Replace_Origin_Record",
  "Request Body": "connectorBuilder.cdkSchema.t.Request_Body",
  "Request Body JSON Payload": "connectorBuilder.cdkSchema.t.Request_Body_JSON_Payload",
  "Request Body Payload (Non-JSON)": "connectorBuilder.cdkSchema.t.Request_Body_Payload_Non_JSON",
  "Request Headers": "connectorBuilder.cdkSchema.t.Request_Headers",
  "Request Option": "connectorBuilder.cdkSchema.t.Request_Option",
  "Request Path": "connectorBuilder.cdkSchema.t.Request_Path",
  "Response Filters": "connectorBuilder.cdkSchema.t.Response_Filters",
  "Response Header": "connectorBuilder.cdkSchema.t.Response_Header",
  "Response Header Name": "connectorBuilder.cdkSchema.t.Response_Header_Name",
  "Response Token Response Key": "connectorBuilder.cdkSchema.t.Response_Token_Response_Key",
  Retriever: "connectorBuilder.cdkSchema.t.Retriever",
  Schema: "connectorBuilder.cdkSchema.t.Schema",
  "Schema Field Type": "connectorBuilder.cdkSchema.t.Schema_Field_Type",
  "Schema Filter": "connectorBuilder.cdkSchema.t.Schema_Filter",
  "Schema Loader": "connectorBuilder.cdkSchema.t.Schema_Loader",
  "Schema Normalization": "connectorBuilder.cdkSchema.t.Schema_Normalization",
  "Schema Path": "connectorBuilder.cdkSchema.t.Schema_Path",
  "Schema Transformations": "connectorBuilder.cdkSchema.t.Schema_Transformations",
  "Schema Type Identifier": "connectorBuilder.cdkSchema.t.Schema_Type_Identifier",
  Schemas: "connectorBuilder.cdkSchema.t.Schemas",
  Scopes: "connectorBuilder.cdkSchema.t.Scopes",
  "Secret Key": "connectorBuilder.cdkSchema.t.Secret_Key",
  "Selective Authenticator": "connectorBuilder.cdkSchema.t.Selective_Authenticator",
  "Session Request Header": "connectorBuilder.cdkSchema.t.Session_Request_Header",
  "Session Token": "connectorBuilder.cdkSchema.t.Session_Token",
  "Session Token Authenticator": "connectorBuilder.cdkSchema.t.Session_Token_Authenticator",
  "Session Token Path": "connectorBuilder.cdkSchema.t.Session_Token_Path",
  "Single Key": "connectorBuilder.cdkSchema.t.Single_Key",
  Spec: "connectorBuilder.cdkSchema.t.Spec",
  "Start Datetime": "connectorBuilder.cdkSchema.t.Start_Datetime",
  "Start From Page": "connectorBuilder.cdkSchema.t.Start_From_Page",
  "Start Value": "connectorBuilder.cdkSchema.t.Start_Value",
  "State Delegating Stream": "connectorBuilder.cdkSchema.t.State_Delegating_Stream",
  "State Migrations": "connectorBuilder.cdkSchema.t.State_Migrations",
  "Status Codes for Rate Limit Hit": "connectorBuilder.cdkSchema.t.Status_Codes_for_Rate_Limit_Hit",
  Step: "connectorBuilder.cdkSchema.t.Step",
  "Stop Condition": "connectorBuilder.cdkSchema.t.Stop_Condition",
  "Stream Config": "connectorBuilder.cdkSchema.t.Stream_Config",
  "Stream Count": "connectorBuilder.cdkSchema.t.Stream_Count",
  "Stream Group": "connectorBuilder.cdkSchema.t.Stream_Group",
  "Stream Names": "connectorBuilder.cdkSchema.t.Stream_Names",
  "Stream Parameters": "connectorBuilder.cdkSchema.t.Stream_Parameters",
  "Stream Parameters Definition": "connectorBuilder.cdkSchema.t.Stream_Parameters_Definition",
  "Stream Template": "connectorBuilder.cdkSchema.t.Stream_Template",
  Streams: "connectorBuilder.cdkSchema.t.Streams",
  "Streams to Check": "connectorBuilder.cdkSchema.t.Streams_to_Check",
  "Strict Start-End Time Comparison": "connectorBuilder.cdkSchema.t.Strict_Start_End_Time_Comparison",
  "Substream Partition Router": "connectorBuilder.cdkSchema.t.Substream_Partition_Router",
  "Synchronous Retriever": "connectorBuilder.cdkSchema.t.Synchronous_Retriever",
  "Token Duration": "connectorBuilder.cdkSchema.t.Token_Duration",
  "Token Expiry Date": "connectorBuilder.cdkSchema.t.Token_Expiry_Date",
  "Token Expiry Date Format": "connectorBuilder.cdkSchema.t.Token_Expiry_Date_Format",
  "Token Expiry Property Name": "connectorBuilder.cdkSchema.t.Token_Expiry_Property_Name",
  "Token Refresh Endpoint": "connectorBuilder.cdkSchema.t.Token_Refresh_Endpoint",
  "Transform Before Filtering": "connectorBuilder.cdkSchema.t.Transform_Before_Filtering",
  "Transformation to apply for extracted object keys by Dpath Flatten Fields":
    "connectorBuilder.cdkSchema.t.Transformation_to_apply_for_extracted_object_keys_by_Dpath_Flatten_Fields",
  Transformations: "connectorBuilder.cdkSchema.t.Transformations",
  "Type Path": "connectorBuilder.cdkSchema.t.Type_Path",
  "Types Map": "connectorBuilder.cdkSchema.t.Types_Map",
  "URL Base": "connectorBuilder.cdkSchema.t.URL_Base",
  "URL Path": "connectorBuilder.cdkSchema.t.URL_Path",
  "URL Path Pattern": "connectorBuilder.cdkSchema.t.URL_Path_Pattern",
  "URL-encoded Body": "connectorBuilder.cdkSchema.t.URL_encoded_Body",
  "Underlying Partition Router": "connectorBuilder.cdkSchema.t.Underlying_Partition_Router",
  "Unlimited Call Rate Policy": "connectorBuilder.cdkSchema.t.Unlimited_Call_Rate_Policy",
  "Use Cache": "connectorBuilder.cdkSchema.t.Use_Cache",
  "Use Check Availability": "connectorBuilder.cdkSchema.t.Use_Check_Availability",
  "Use Parent Parameters": "connectorBuilder.cdkSchema.t.Use_Parent_Parameters",
  "Use Profile Assertion": "connectorBuilder.cdkSchema.t.Use_Profile_Assertion",
  Username: "connectorBuilder.cdkSchema.t.Username",
  "Validate Adheres To Schema": "connectorBuilder.cdkSchema.t.Validate_Adheres_To_Schema",
  "Validate Session Path": "connectorBuilder.cdkSchema.t.Validate_Session_Path",
  "Validation Strategy": "connectorBuilder.cdkSchema.t.Validation_Strategy",
  Value: "connectorBuilder.cdkSchema.t.Value",
  "Value Mapping": "connectorBuilder.cdkSchema.t.Value_Mapping",
  "Value Type": "connectorBuilder.cdkSchema.t.Value_Type",
  "Wait Time Extracted From Response Header": "connectorBuilder.cdkSchema.t.Wait_Time_Extracted_From_Response_Header",
  "Wait Until Time Defined In Response Header":
    "connectorBuilder.cdkSchema.t.Wait_Until_Time_Defined_In_Response_Header",
  Weight: "connectorBuilder.cdkSchema.t.Weight",
  XML: "connectorBuilder.cdkSchema.t.XML",
  "ZIP File": "connectorBuilder.cdkSchema.t.ZIP_File",
  gzip: "connectorBuilder.cdkSchema.t.gzip",
};

const CDK_DESCRIPTION_MESSAGE_IDS: Record<string, string> = {
  "(This component is experimental. Use at your own risk.) Component resolve and populates stream templates with components fetched via an HTTP retriever.":
    "connectorBuilder.cdkSchema.d.Http_Components_Resolver",
  "(This component is experimental. Use at your own risk.) Defines the dynamic streams to try reading when running a check operation.":
    "connectorBuilder.cdkSchema.descExact.This_component_is_experimental_Use_at_your_own_r",
  "(This component is experimental. Use at your own risk.) Defines the dynamic streams to try reading when running a check operation.\n":
    "connectorBuilder.cdkSchema.descExact.This_component_is_experimental_Use_at_your_own_r",
  "(This component is experimental. Use at your own risk.) Describes how to get streams config from the source config.":
    "connectorBuilder.cdkSchema.d.Stream_Config",
  "(This component is experimental. Use at your own risk.) Identifies schema details for dynamic schema extraction and processing.":
    "connectorBuilder.cdkSchema.d.Schema_Type_Identifier",
  "(This component is experimental. Use at your own risk.) Loads a schema by extracting data from retrieved records.":
    "connectorBuilder.cdkSchema.d.Dynamic_Schema_Loader",
  "(This component is experimental. Use at your own risk.) Orchestrate the retriever's usage based on the state value.":
    "connectorBuilder.cdkSchema.d.State_Delegating_Stream",
  "(This component is experimental. Use at your own risk.) Represents a complex field type.":
    "connectorBuilder.cdkSchema.d.Schema_Field_Type",
  "(This component is experimental. Use at your own risk.) Represents a mapping between a current type and its corresponding target type.":
    "connectorBuilder.cdkSchema.d.Types_Map",
  "(This component is experimental. Use at your own risk.) Represents a stream parameters definition to set up dynamic streams from defined values in manifest.":
    "connectorBuilder.cdkSchema.d.Stream_Parameters_Definition",
  "(This component is experimental. Use at your own risk.) Resolves and populates dynamic streams from defined parametrized values in manifest.":
    "connectorBuilder.cdkSchema.d.Parametrized_Components_Resolver",
  "(This component is experimental. Use at your own risk.) Resolves and populates stream templates with components fetched from the source config.":
    "connectorBuilder.cdkSchema.d.Config_Components_Resolver",
  "(This component is experimental. Use at your own risk.) Specifies a mapping definition to update or add fields in a record or configuration. This allows dynamic mapping of data by interpolating values into the template based on provided contexts.":
    "connectorBuilder.cdkSchema.d.Component_Mapping_Definition",
  "(experimental) Describes how to fetch a file": "connectorBuilder.cdkSchema.d.File_Uploader",
  "A Partition router that specifies a list of attributes where each attribute describes a portion of the complete data set for a stream. During a sync, each value is iterated over and can be used as input to outbound API requests.":
    "connectorBuilder.cdkSchema.d.List_Partition_Router",
  "A config migration that will be applied on the incoming config at the start of a sync.":
    "connectorBuilder.cdkSchema.d.Config_Migration",
  "A connection specification describing how a the connector can be configured.":
    "connectorBuilder.cdkSchema.d.Connection_Specification",
  "A custom config transformation that can be used to transform the connector configuration.":
    "connectorBuilder.cdkSchema.d.Custom_Config_Transformation",
  "A data feed API is an API that does not allow filtering and paginates the content from the most recent to the least recent. Given this, the CDK needs to know when to stop paginating and this field will generate a stop condition for pagination.":
    "connectorBuilder.cdkSchema.d.Data_Feed_API",
  "A decorator on top of a partition router that groups partitions into batches of a specified size. This is useful for APIs that support filtering by multiple partition keys in a single request. Note that per-partition incremental syncs may not work as expected because the grouping of partitions might change between syncs, potentially leading to inconsistent state tracking.\n":
    "connectorBuilder.cdkSchema.d.Grouping_Partition_Router",
  "A group of streams that share a common resource and should not be read simultaneously. Streams in the same group will be blocked from concurrent reads based on the specified action.\n":
    "connectorBuilder.cdkSchema.d.Stream_Group",
  "A list of default values, each matching the structure expected from the parsed component value.":
    "connectorBuilder.cdkSchema.d.Default_Values",
  "A list of field pointers to be removed from the config.": "connectorBuilder.cdkSchema.d.Field_Pointers",
  "A list of object of parameters for stream, each object in the list represents params for one stream.":
    "connectorBuilder.cdkSchema.d.Stream_Parameters",
  "A list of potentially nested fields indicating the full path in source config file where streams configs located.":
    "connectorBuilder.cdkSchema.d.Configs_Pointer",
  "A list of transformations to be applied to each output record.": "connectorBuilder.cdkSchema.d.Transformations",
  "A list of transformations to be applied to the schema.": "connectorBuilder.cdkSchema.d.Schema_Transformations",
  "A mapping of original values to new values. When a field value matches a key in this map, it will be replaced with the corresponding value.":
    "connectorBuilder.cdkSchema.d.Value_Mapping",
  "A passphrase/password used to encrypt the private key. Only provide a passphrase if required by the API for JWT authentication. The API will typically provide the passphrase when generating the public/private key pair.":
    "connectorBuilder.cdkSchema.d.Passphrase",
  "A policy that allows a fixed number of calls within a moving time window.":
    "connectorBuilder.cdkSchema.d.Moving_Window_Call_Rate_Policy",
  "A policy that allows a fixed number of calls within a specific time window.":
    "connectorBuilder.cdkSchema.d.Fixed_Window_Call_Rate_Policy",
  "A policy that allows unlimited calls for specific requests.":
    "connectorBuilder.cdkSchema.d.Unlimited_Call_Rate_Policy",
  "A record extractor designed for handling large responses that may exceed memory limits (to prevent OOM issues). It downloads a CSV file to disk, reads the data from disk, and deletes the file once it has been fully processed.":
    "connectorBuilder.cdkSchema.d.CSV_To_File_Extractor",
  "A regular expression pattern to match the URL path.": "connectorBuilder.cdkSchema.d.URL_Path_Pattern",
  "A request option describing where the list value should be injected into and under what field name if applicable.":
    "connectorBuilder.cdkSchema.d.Inject_Partition_Value_Into_Outgoing_HTTP_Request",
  "A request option describing where the signed JWT token that is generated should be injected into the outbound API request.":
    "connectorBuilder.cdkSchema.d.Request_Option",
  "A source specification made up of connector metadata and how it can be configured.":
    "connectorBuilder.cdkSchema.d.Spec",
  "A stream whose behavior is described by a set of declarative low code components.":
    "connectorBuilder.cdkSchema.d.Declarative_Stream",
  'A template for the token value to inject. Use {{ session_token }} to reference the session token. For example, use "Token {{ session_token }}" for APIs that expect "Authorization: Token <token>".':
    "connectorBuilder.cdkSchema.d.API_Token_Template",
  "A transformation that flatten field values to the to top of the record.":
    "connectorBuilder.cdkSchema.d.Dpath_Flatten_Fields",
  "A transformation that flatten record to single level format.": "connectorBuilder.cdkSchema.d.Flatten_Fields",
  "A transformation that renames all keys to lower case.": "connectorBuilder.cdkSchema.d.Keys_to_Lower_Case",
  "A transformation that renames all keys to snake case.": "connectorBuilder.cdkSchema.d.Key_to_Snake_Case",
  "A transformation that replaces symbols in keys.": "connectorBuilder.cdkSchema.d.Keys_Replace",
  "A transformation which removes fields from a record. The fields removed are designated using FieldPointers. During transformation, if a field or any of its parents does not exist in the record, no error is thrown.":
    "connectorBuilder.cdkSchema.d.Remove_Fields",
  "Action that prevents streams in the same group from being read concurrently. When applied to a stream group, streams with this action will be deferred if another stream in the same group is currently active. This is useful for APIs that don't allow concurrent access to the same endpoint or session. Only applies to ConcurrentDeclarativeSource.\n":
    "connectorBuilder.cdkSchema.d.Block_Simultaneous_Syncs_Action",
  "Action to execute if a response matches the filter.": "connectorBuilder.cdkSchema.d.Action",
  "Additional and optional specification object to describe what an 'advanced' Auth flow would need to function.\n  - A connector should be able to fully function with the configuration as described by the ConnectorSpecification in a 'basic' mode.\n  - The 'advanced' mode provides easier UX for the user with UI improvements and automations. However, this requires further setup on the\n  server side by instance or workspace admins beforehand. The trade-off is that the user does not have to provide as many technical\n  inputs anymore and the auth process is faster and easier to complete.":
    "connectorBuilder.cdkSchema.d.Auth_flow",
  "Additional headers to be included with the JWT headers object.":
    "connectorBuilder.cdkSchema.d.Additional_JWT_Headers",
  "Additional properties to be added to the JWT payload.":
    "connectorBuilder.cdkSchema.d.Additional_JWT_Payload_Properties",
  "Advanced specification for configuring the authentication flow.": "connectorBuilder.cdkSchema.d.Advanced_Auth",
  "Algorithm used to sign the JSON web token.": "connectorBuilder.cdkSchema.d.Algorithm",
  "Allows for retrieving a dynamic set of properties from an API endpoint which can be injected into outbound request using the stream_partition.extra_fields.":
    "connectorBuilder.cdkSchema.d.Fetch_Properties_from_Endpoint",
  "An array of arrays representing a composite primary key where the fields are nested fields.":
    "connectorBuilder.cdkSchema.d.Composite_Key_of_Nested_Fields",
  "An array of top-level fields representing a composite primary key.": "connectorBuilder.cdkSchema.d.Composite_Key",
  "Apply a custom transformation on the input state.": "connectorBuilder.cdkSchema.d.Custom_State_Migration",
  "Array of field paths to include as additional fields in the stream slice. Each path is an array of strings representing keys to access fields in the respective parent record. Accessible via `stream_slice.extra_fields`. Missing fields are set to `None`.":
    "connectorBuilder.cdkSchema.d.Extra_Fields",
  "Array of paths defining the field to remove. Each item is an array whose field describe the path of a field to remove.":
    "connectorBuilder.cdkSchema.d.Field_Paths",
  "Array of state migrations to be applied on the input state": "connectorBuilder.cdkSchema.d.State_Migrations",
  "Authentication method to use for requests sent to the API, specifying how to inject the session token.":
    "connectorBuilder.cdkSchema.d.Data_Request_Authentication",
  "Authentication method to use for requests sent to the API.": "connectorBuilder.cdkSchema.d.Authenticator",
  "Authenticator component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Authenticator",
  "Authenticator for requests authenticated with a bearer token injected as a request header of the form `Authorization: Bearer <token>`.":
    "connectorBuilder.cdkSchema.d.Bearer_Token_Authenticator",
  "Authenticator for requests authenticated with an API token injected as an HTTP request header.":
    "connectorBuilder.cdkSchema.d.API_Key_Authenticator",
  "Authenticator for requests authenticated with the Basic HTTP authentication scheme, which encodes a username and an optional password in the Authorization request header.":
    "connectorBuilder.cdkSchema.d.Basic_HTTP_Authenticator",
  "Authenticator for requests requiring no authentication.": "connectorBuilder.cdkSchema.d.No_Authentication",
  "Authenticator for requests using JWT authentication flow.": "connectorBuilder.cdkSchema.d.JWT_Authenticator",
  "Authenticator for requests using OAuth 2.0 authorization flow.": "connectorBuilder.cdkSchema.d.OAuth2",
  "Authenticator for requests using the session token as a standard bearer token.":
    "connectorBuilder.cdkSchema.d.Bearer_Authenticator",
  "Authenticator for requests using the session token as an API key that's injected into the request.":
    "connectorBuilder.cdkSchema.d.Session_Token_Authenticator",
  "Authenticator that selects concrete authenticator based on config property.":
    "connectorBuilder.cdkSchema.d.Selective_Authenticator",
  "Authenticators to select from.": "connectorBuilder.cdkSchema.d.Authenticators",
  "Backoff strategy component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Backoff_Strategy",
  "Backoff strategy with a constant backoff interval.": "connectorBuilder.cdkSchema.d.Constant_Backoff",
  "Backoff strategy with an exponential backoff interval. The interval is defined as factor * 2^attempt_count.":
    "connectorBuilder.cdkSchema.d.Exponential_Backoff",
  "Backoff time in seconds.": "connectorBuilder.cdkSchema.d.Backoff_Time",
  'Behavior when the expansion path is missing, not a list, or an empty list. "skip" (default) emits nothing. "emit_parent" emits the original parent record unchanged.':
    "connectorBuilder.cdkSchema.d.On_No_Records",
  "Body of the request sent to get a new access token.": "connectorBuilder.cdkSchema.d.Refresh_Request_Body",
  "Ceiling applied on the datetime value. Must be formatted with the datetime_format field.":
    "connectorBuilder.cdkSchema.d.Max_Datetime",
  "Compares the provided date against optional minimum or maximum times. The max_datetime serves as the ceiling and will be returned when datetime exceeds it. The min_datetime serves as the floor.":
    "connectorBuilder.cdkSchema.d.Min_Max_Datetime",
  "Component decoding the download response so records can be extracted.":
    "connectorBuilder.cdkSchema.d.Download_HTTP_Response_Format",
  "Component decoding the response so records can be extracted.": "connectorBuilder.cdkSchema.d.HTTP_Response_Format",
  "Component defining how to handle errors. Default behavior includes only retrying server errors (HTTP 5XX) and too many requests (HTTP 429) with an exponential backoff.":
    "connectorBuilder.cdkSchema.d.Default_Error_Handler",
  "Component resolve and populates stream templates with components values.":
    "connectorBuilder.cdkSchema.d.Components_Resolver",
  "Component used to coordinate how records are extracted across stream slices and request pages when the state is empty or not provided.":
    "connectorBuilder.cdkSchema.d.Full_Refresh_Stream",
  "Component used to coordinate how records are extracted across stream slices and request pages when the state provided.":
    "connectorBuilder.cdkSchema.d.Incremental_Stream",
  "Component used to coordinate how records are extracted across stream slices and request pages.":
    "connectorBuilder.cdkSchema.d.Retriever",
  "Component used to decode the response.": "connectorBuilder.cdkSchema.d.Decoder",
  "Component used to fetch data incrementally based on a time field in the data.":
    "connectorBuilder.cdkSchema.d.Incremental_Sync",
  "Condition that will be evaluated to determine if a set of streams should be available.":
    "connectorBuilder.cdkSchema.d.Condition",
  "Configure how the API Key will be sent in requests to the source API. Either inject_into or header has to be defined.":
    "connectorBuilder.cdkSchema.d.Inject_API_Key_Into_Outgoing_HTTP_Request",
  "Configures where the descriptor should be set on the HTTP requests. Note that request parameters that are already encoded in the URL path will not be duplicated.":
    "connectorBuilder.cdkSchema.d.Inject_Into",
  "Configures which key should be used in the location that the descriptor is being injected into. We hope to eventually deprecate this field in favor of `field_path` for all request_options, but must currently maintain it for backwards compatibility in the Builder.":
    "connectorBuilder.cdkSchema.d.Field_Name",
  "Credential artifact used to get a new access token.": "connectorBuilder.cdkSchema.d.Refresh_Token",
  "Cursor that allows for incremental sync according to a continuously increasing integer.":
    "connectorBuilder.cdkSchema.d.Incrementing_Count_Cursor",
  "Cursor to provide incremental capabilities over datetime.": "connectorBuilder.cdkSchema.d.Datetime_Based_Cursor",
  "Custom validation strategy that allows for custom validation logic.":
    "connectorBuilder.cdkSchema.d.Custom_Validation_Strategy",
  "Datetime value.": "connectorBuilder.cdkSchema.d.Datetime",
  "Default pagination implementation to request pages of results with a fixed size until the pagination strategy no longer returns a next_page_token.":
    "connectorBuilder.cdkSchema.d.Default_Paginator",
  "Defines a rate limit with a specific number of calls allowed within a time interval.":
    "connectorBuilder.cdkSchema.d.Rate",
  "Defines how many requests can be made to the API in a given time frame. `HTTPAPIBudget` extracts the remaining call count and the reset time from HTTP response headers using the header names provided by `ratelimit_remaining_header` and `ratelimit_reset_header`. Only requests using `HttpRequester` are rate-limited; custom components that bypass `HttpRequester` are not covered by this budget.":
    "connectorBuilder.cdkSchema.descExact.Defines_how_many_requests_can_be_made_to_the_API_i",
  "Defines how many requests can be made to the API in a given time frame. `HTTPAPIBudget` extracts the remaining call count and the reset time from HTTP response headers using the header names provided by `ratelimit_remaining_header` and `ratelimit_reset_header`. Only requests using `HttpRequester` are rate-limited; custom components that bypass `HttpRequester` are not covered by this budget.\n":
    "connectorBuilder.cdkSchema.descExact.Defines_how_many_requests_can_be_made_to_the_API_i",
  "Defines the amount of parallelization for the streams that are being synced. The factor of parallelization is how many partitions or streams are synced at the same time. For example, with a concurrency_level of 10, ten streams or partitions of data will processed at the same time. Note that a value of 1 could create deadlock if a stream has a very high number of partitions.":
    "connectorBuilder.cdkSchema.descExact.Defines_the_amount_of_parallelization_for_the_stre",
  "Defines the amount of parallelization for the streams that are being synced. The factor of parallelization is how many partitions or streams are synced at the same time. For example, with a concurrency_level of 10, ten streams or partitions of data will processed at the same time. Note that a value of 1 could create deadlock if a stream has a very high number of partitions.\n":
    "connectorBuilder.cdkSchema.descExact.Defines_the_amount_of_parallelization_for_the_stre",
  "Defines the behavior for fetching the list of properties from an API that will be loaded into the requests to extract records. Note that stream_slices can't be interpolated from this retriever.":
    "connectorBuilder.cdkSchema.d.Properties_from_Endpoint",
  "Defines the field to add on a record.": "connectorBuilder.cdkSchema.d.Definition_Of_Field_To_Add",
  "Defines the streams to try reading when running a check operation.":
    "connectorBuilder.cdkSchema.descExact.Defines_the_streams_to_try_reading_when_running_a",
  "Defines the streams to try reading when running a check operation.\n":
    "connectorBuilder.cdkSchema.descExact.Defines_the_streams_to_try_reading_when_running_a",
  "Defines where to look for and which query properties that should be sent in outbound API requests. For example, you can specify that only the selected columns of a stream should be in the request.":
    "connectorBuilder.cdkSchema.d.Property_Selector",
  "Deprecated, use the `url` instead. Base URL of the API source. Do not put sensitive information (e.g. API tokens) into this field - Use the Authenticator component for this.":
    "connectorBuilder.cdkSchema.d.API_Base_URL",
  "Deprecated, use the `url` instead. Path the specific API endpoint that this stream represents. Do not put sensitive information (e.g. API tokens) into this field - Use the Authenticator component for this.":
    "connectorBuilder.cdkSchema.d.URL_Path",
  'Describes a streams\' schema. Refer to the <a href="https://docs.airbyte.com/understanding-airbyte/supported-data-types/">Data Types documentation</a> for more details on which types are valid.':
    "connectorBuilder.cdkSchema.d.Schema",
  "Describes how to construct partitions from the records retrieved from the parent stream..":
    "connectorBuilder.cdkSchema.d.Parent_Stream_Config",
  "Describes the limits that trigger pagination reset": "connectorBuilder.cdkSchema.d.Pagination_Reset_Limits",
  "Describes what triggers pagination reset and how to handle it. If SPLIT_USING_CURSOR, the connector developer is accountable for ensuring that the records are returned in ascending order.":
    "connectorBuilder.cdkSchema.d.Pagination_Reset",
  "Description of the request to perform to obtain a session token to perform data requests. The response body is expected to be a JSON object with a session token property.":
    "connectorBuilder.cdkSchema.d.Login_Requester",
  "Determines whether to create a new path if it doesn't exist (true) or only update existing paths (false). When set to true, the resolver will create new paths in the stream template if they don't exist. When false (default), it will only update existing paths.":
    "connectorBuilder.cdkSchema.d.Create_or_Update",
  "Dictates how to records that require multiple requests to get all properties should be emitted to the destination":
    "connectorBuilder.cdkSchema.d.Record_Merge_Strategy",
  "Enable using profile assertion as a flow for OAuth authorization.":
    "connectorBuilder.cdkSchema.d.Use_Profile_Assertion",
  "Enables stream check availability. This field is automatically set by the CDK.":
    "connectorBuilder.cdkSchema.descExact.Enables_stream_check_availability_This_field_is_a",
  "Enables stream check availability. This field is automatically set by the CDK.\n":
    "connectorBuilder.cdkSchema.descExact.Enables_stream_check_availability_This_field_is_a",
  "Enables stream requests caching. When set to true, repeated requests to the same URL will return cached responses. Parent streams automatically have caching enabled. Only set this to false if you are certain that caching should be disabled, as it may negatively impact performance when the same data is needed multiple times (e.g., for scroll-based pagination APIs where caching causes duplicate records).":
    "connectorBuilder.cdkSchema.d.Use_Cache",
  "Error Message to display if the response matches the filter.": "connectorBuilder.cdkSchema.d.Error_Message",
  "Error handler component that defines how to handle errors.": "connectorBuilder.cdkSchema.d.Error_Handler",
  "Error handler component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Error_Handler",
  "Error handler that sequentially iterates over a list of error handlers.":
    "connectorBuilder.cdkSchema.d.Composite_Error_Handler",
  "Extract time at which we can retry the request from response header and wait for the difference between now and that time.":
    "connectorBuilder.cdkSchema.d.Wait_Until_Time_Defined_In_Response_Header",
  "Extract wait time from a HTTP header in the response.":
    "connectorBuilder.cdkSchema.d.Wait_Time_Extracted_From_Response_Header",
  "Failure type of traced exception if a response matches the filter.": "connectorBuilder.cdkSchema.d.Failure_Type",
  "Filter applied on a list of records.": "connectorBuilder.cdkSchema.d.Record_Filter",
  "Floor applied on the datetime value. Must be formatted with the datetime_format field.":
    "connectorBuilder.cdkSchema.d.Min_Datetime",
  "For APIs that require explicit specification of the properties to query for, this component will take a static or dynamic set of properties (which can be optionally split into chunks) and allow them to be injected into an outbound request by accessing stream_partition.extra_fields.":
    "connectorBuilder.cdkSchema.d.Query_Properties",
  "For APIs with restrictions on the amount of properties that can be requester per request, property chunking can be applied to make multiple requests with a subset of the properties.":
    "connectorBuilder.cdkSchema.d.Property_Chunking",
  'Format of the datetime value. Defaults to "%Y-%m-%dT%H:%M:%S.%f%z" if left empty. Use placeholders starting with "%" to describe the format the API is using. The following placeholders are available:\n  * **%s**: Epoch unix timestamp - `1686218963`\n  * **%s_as_float**: Epoch unix timestamp in seconds as float with microsecond precision - `1686218963.123456`\n  * **%ms**: Epoch unix timestamp - `1686218963123`\n  * **%a**: Weekday (abbreviated) - `Sun`\n  * **%A**: Weekday (full) - `Sunday`\n  * **%w**: Weekday (decimal) - `0` (Sunday), `6` (Saturday)\n  * **%d**: Day of the month (zero-padded) - `01`, `02`, ..., `31`\n  * **%b**: Month (abbreviated) - `Jan`\n  * **%B**: Month (full) - `January`\n  * **%m**: Month (zero-padded) - `01`, `02`, ..., `12`\n  * **%y**: Year (without century, zero-padded) - `00`, `01`, ..., `99`\n  * **%Y**: Year (with century) - `0001`, `0002`, ..., `9999`\n  * **%H**: Hour (24-hour, zero-padded) - `00`, `01`, ..., `23`\n  * **%I**: Hour (12-hour, zero-padded) - `01`, `02`, ..., `12`\n  * **%p**: AM/PM indicator\n  * **%M**: Minute (zero-padded) - `00`, `01`, ..., `59`\n  * **%S**: Second (zero-padded) - `00`, `01`, ..., `59`\n  * **%f**: Microsecond (zero-padded to 6 digits) - `000000`, `000001`, ..., `999999`\n  * **%_ms**: Millisecond (zero-padded to 3 digits) - `000`, `001`, ..., `999`\n  * **%z**: UTC offset - `(empty)`, `+0000`, `-04:00`\n  * **%Z**: Time zone name - `(empty)`, `UTC`, `GMT`\n  * **%j**: Day of the year (zero-padded) - `001`, `002`, ..., `366`\n  * **%U**: Week number of the year (Sunday as first day) - `00`, `01`, ..., `53`\n  * **%W**: Week number of the year (Monday as first day) - `00`, `01`, ..., `53`\n  * **%c**: Date and time representation - `Tue Aug 16 21:30:00 1988`\n  * **%x**: Date representation - `08/16/1988`\n  * **%X**: Time representation - `21:30:00`\n  * **%%**: Literal \'%\' character\n\n  Some placeholders depend on the locale of the underlying system - in most cases this locale is configured as en/US. For more information see the [Python documentation](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes).\n':
    "connectorBuilder.cdkSchema.d.Datetime_Format",
  "Fully-qualified name of the class that will be implementing the custom authentication strategy. Has to be a sub class of DeclarativeAuthenticator. The format is `source_<name>.<package>.<class_name>`.":
    "connectorBuilder.cdkSchema.d.Class_Name",
  "Given the value extracted from the header is greater than this value, stop the stream.":
    "connectorBuilder.cdkSchema.d.Max_Waiting_Time_in_Seconds",
  "Headers of the request sent to get a new access token.": "connectorBuilder.cdkSchema.d.Refresh_Request_Headers",
  "If set, this will enable lazy reading, using the initial read of parent records to extract child records.":
    "connectorBuilder.cdkSchema.d.Lazy_Read_Pointer",
  'If true, each expanded record will include the original parent record in an "original_record" field. Defaults to false.':
    "connectorBuilder.cdkSchema.d.Remain_Original_Record",
  "If true, ensures that partitions are unique within each group by removing duplicates based on the partition key.":
    "connectorBuilder.cdkSchema.d.Deduplicate_Partitions",
  "If true, transformation will be applied before record filtering.":
    "connectorBuilder.cdkSchema.d.Transform_Before_Filtering",
  "Index of the first page to request.": "connectorBuilder.cdkSchema.d.Start_From_Page",
  "Indicates whether the parent stream should be read incrementally based on updates in the child stream.":
    "connectorBuilder.cdkSchema.d.Incremental_Dependency",
  "Inject the page token into the outgoing HTTP requests by inserting it into either the request URL path or a field on the request.":
    "connectorBuilder.cdkSchema.d.Inject_Page_Token_Into_Outgoing_HTTP_Request",
  "JSON path to a field in the connectorSpecification that should exist for the advanced auth to be applicable.":
    "connectorBuilder.cdkSchema.d.Predicate_key",
  "JWT Payload used when signing JSON web token.": "connectorBuilder.cdkSchema.d.JWT_Payload",
  "JWT headers used when signing JSON web token.": "connectorBuilder.cdkSchema.d.JWT_Headers",
  "Key to Identify refresh token error in response (Refresh Token Error Status Codes and Refresh Token Error Values should be also specified).":
    "connectorBuilder.cdkSchema.d.Refresh_Token_Error_Key",
  "List of HTTP status codes that indicate a rate limit has been hit.":
    "connectorBuilder.cdkSchema.descExact.List_of_HTTP_status_codes_that_indicate_a_rate_lim",
  "List of HTTP status codes that indicate a rate limit has been hit.\n":
    "connectorBuilder.cdkSchema.descExact.List_of_HTTP_status_codes_that_indicate_a_rate_lim",
  "List of backoff strategies to use to determine how long to wait before retrying a retryable request.":
    "connectorBuilder.cdkSchema.d.Backoff_Strategies",
  "List of call rate policies that define how many calls are allowed.":
    "connectorBuilder.cdkSchema.descExact.List_of_call_rate_policies_that_define_how_many_ca",
  "List of call rate policies that define how many calls are allowed.\n":
    "connectorBuilder.cdkSchema.descExact.List_of_call_rate_policies_that_define_how_many_ca",
  "List of error handlers to iterate on to determine how to handle a failed response.":
    "connectorBuilder.cdkSchema.d.Error_Handlers",
  "List of matchers that define which requests this policy applies to.": "connectorBuilder.cdkSchema.d.Matchers",
  "List of nested fields defining the schema field path to extract. Defaults to [].":
    "connectorBuilder.cdkSchema.d.Schema_Path",
  "List of potentially nested fields describing the full path of the field key to extract.":
    "connectorBuilder.cdkSchema.d.Key_Path",
  'List of potentially nested fields describing the full path of the field to extract. Use "*" to extract all values from an array. See more info in the [docs](https://docs.airbyte.com/connector-development/config-based/understanding-the-yaml-file/record-selector).':
    "connectorBuilder.cdkSchema.d.Field_Path",
  "List of potentially nested fields describing the full path of the field type to extract.":
    "connectorBuilder.cdkSchema.d.Type_Path",
  "List of rates that define the call limits for different time intervals.": "connectorBuilder.cdkSchema.d.Rates",
  "List of response filters to iterate on when deciding how to handle an error. When using an array of multiple filters, the filters will be applied sequentially and the response will be selected if it matches any of the filter's predicate.":
    "connectorBuilder.cdkSchema.d.Response_Filters",
  "List of scopes that should be granted to the access token.": "connectorBuilder.cdkSchema.d.Scopes",
  "List of strings defining the path where to add the value on the record.": "connectorBuilder.cdkSchema.d.Path",
  "List of transformations (path and corresponding value) that will be added to the record.":
    "connectorBuilder.cdkSchema.d.Fields",
  'List of values to check for exception during token refresh process. Used to check if the error found in the response matches the key from the Refresh Token Error Key field (e.g. response={"error": "invalid_grant"}). Only responses with one of the error status code and containing an error value will be flagged as a config error':
    "connectorBuilder.cdkSchema.d.Refresh_Token_Error_Values",
  "Loads a schema that is defined directly in the manifest file.": "connectorBuilder.cdkSchema.d.Inline_Schema_Loader",
  "Loads the schema from a json file.": "connectorBuilder.cdkSchema.d.Json_File_Schema_Loader",
  "Match the response if its HTTP code is included in this list.": "connectorBuilder.cdkSchema.d.HTTP_Codes",
  "Match the response if its error message contains the substring.":
    "connectorBuilder.cdkSchema.d.Error_Message_Substring",
  "Match the response if the predicate evaluates to true.": "connectorBuilder.cdkSchema.d.Predicate",
  "Matches HTTP requests based on method, base URL, URL path pattern, query parameters, and headers. Use `url_base` to specify the scheme and host (without trailing slash) and `url_path_pattern` to apply a regex to the request path.\n":
    "connectorBuilder.cdkSchema.d.HTTP_Request_Matcher",
  "Minimum time to wait before retrying.": "connectorBuilder.cdkSchema.d.Minimum_Wait_Time",
  "Multiplicative constant applied on each retry.": "connectorBuilder.cdkSchema.d.Factor",
  "Name of the key of the session token to be extracted from the response":
    "connectorBuilder.cdkSchema.d.Response_Token_Response_Key",
  "Name of the partition end time field.": "connectorBuilder.cdkSchema.d.Partition_Field_Start",
  "Name of the partition start time field.": "connectorBuilder.cdkSchema.d.Partition_Field_End",
  "Names of the streams to try reading from when running a check operation.":
    "connectorBuilder.cdkSchema.descExact.Names_of_the_streams_to_try_reading_from_when_runn",
  "Names of the streams to try reading from when running a check operation.\n":
    "connectorBuilder.cdkSchema.descExact.Names_of_the_streams_to_try_reading_from_when_runn",
  "New value to set.": "connectorBuilder.cdkSchema.d.New_value",
  "Numbers of the streams to try reading from when running a check operation.":
    "connectorBuilder.cdkSchema.descExact.Numbers_of_the_streams_to_try_reading_from_when_ru",
  "Numbers of the streams to try reading from when running a check operation.\n":
    "connectorBuilder.cdkSchema.descExact.Numbers_of_the_streams_to_try_reading_from_when_ru",
  "OAuth specific blob. This is a Json Schema used to validate Json configurations persisted as Airbyte Server configurations that\nalso need to be merged back into the connector configuration at runtime.\nThis is a subset configuration of `complete_oauth_server_input_specification` that filters fields out to retain only the ones that\nare necessary for the connector to function with OAuth. (some fields could be used during oauth flows but not needed afterwards, therefore\nthey would be listed in the `complete_oauth_server_input_specification` but not `complete_oauth_server_output_specification`)\nMust be a valid non-nested JSON describing additional fields configured by the Airbyte Instance or Workspace Admins to be used by the\nconnector when using OAuth flow APIs.\nThese fields are to be merged back to `ConnectorSpecification.connectionSpecification`.\nFor each field, a special annotation `path_in_connector_config` can be specified to determine where to merge it,\nExamples:\n      complete_oauth_server_output_specification={\n        client_id: {\n          type: string,\n          path_in_connector_config: ['credentials', 'client_id']\n        },\n        client_secret: {\n          type: string,\n          path_in_connector_config: ['credentials', 'client_secret']\n        }\n      }":
    "connectorBuilder.cdkSchema.d.OAuth_server_output_specification",
  "OAuth specific blob. This is a Json Schema used to validate Json configurations persisted as Airbyte Server configurations.\nMust be a valid non-nested JSON describing additional fields configured by the Airbyte Instance or Workspace Admins to be used by the\nserver when completing an OAuth flow (typically exchanging an auth code for refresh token).\nExamples:\n    complete_oauth_server_input_specification={\n      client_id: {\n        type: string\n      },\n      client_secret: {\n        type: string\n      }\n    }":
    "connectorBuilder.cdkSchema.d.OAuth_input_specification",
  "OAuth specific blob. This is a Json Schema used to validate Json configurations produced by the OAuth flows as they are\nreturned by the distant OAuth APIs.\nMust be a valid JSON describing the fields to merge back to `ConnectorSpecification.connectionSpecification`.\nFor each field, a special annotation `path_in_connector_config` can be specified to determine where to merge it,\nExamples:\n    complete_oauth_output_specification={\n      refresh_token: {\n        type: string,\n        path_in_connector_config: ['credentials', 'refresh_token']\n      }\n    }":
    "connectorBuilder.cdkSchema.d.OAuth_output_specification",
  "OAuth specific blob. This is a Json Schema used to validate Json configurations used as input to OAuth.\nMust be a valid non-nested JSON that refers to properties from ConnectorSpecification.connectionSpecification\nusing special annotation 'path_in_connector_config'.\nThese are input values the user is entering through the UI to authenticate to the connector, that might also shared\nas inputs for syncing data via the connector.\nExamples:\nif no connector values is shared during oauth flow, oauth_user_input_from_connector_config_specification=[]\nif connector values such as 'app_id' inside the top level are used to generate the API url for the oauth flow,\n  oauth_user_input_from_connector_config_specification={\n    app_id: {\n      type: string\n      path_in_connector_config: ['app_id']\n    }\n  }\nif connector values such as 'info.app_id' nested inside another object are used to generate the API url for the oauth flow,\n  oauth_user_input_from_connector_config_specification={\n    app_id: {\n      type: string\n      path_in_connector_config: ['info', 'app_id']\n    }\n  }":
    "connectorBuilder.cdkSchema.d.OAuth_user_input",
  "Old value to replace.": "connectorBuilder.cdkSchema.d.Old_value",
  "One or many schema loaders can be used to retrieve the schema for the current stream. When multiple schema loaders are defined, schema properties will be merged together. Schema loaders defined first taking precedence in the event of a conflict.":
    "connectorBuilder.cdkSchema.d.Schema_Loader",
  "Optional component to expand records by extracting items from nested array fields.":
    "connectorBuilder.cdkSchema.d.Record_Expander",
  "Optional regex to apply on the header to extract its value. The regex should define a capture group defining the wait time.":
    "connectorBuilder.cdkSchema.d.Extraction_Regex",
  "Optionally configures how the end datetime will be sent in requests to the source API.":
    "connectorBuilder.cdkSchema.d.Inject_End_Time_Into_Outgoing_HTTP_Request",
  "Optionally configures how the start datetime will be sent in requests to the source API.":
    "connectorBuilder.cdkSchema.d.Inject_Start_Time_Into_Outgoing_HTTP_Request",
  "Optionally configures how the start value will be sent in requests to the source API.":
    "connectorBuilder.cdkSchema.d.Inject_Start_Value_Into_Outgoing_HTTP_Request",
  "Pagination implementation that never returns a next page.": "connectorBuilder.cdkSchema.d.No_Pagination",
  "Pagination strategy component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Pagination_Strategy",
  "Pagination strategy that evaluates an interpolated string to define the next page to fetch.":
    "connectorBuilder.cdkSchema.d.Cursor_Pagination",
  "Pagination strategy that returns the number of pages reads so far and returns it as the next page token.":
    "connectorBuilder.cdkSchema.d.Page_Increment",
  "Pagination strategy that returns the number of records reads so far and returns it as the next page token.":
    "connectorBuilder.cdkSchema.d.Offset_Increment",
  "Parser to parse the decompressed data from the zipfile(s).": "connectorBuilder.cdkSchema.d.Parser",
  "Partition router component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Partition_Router",
  "Partition router that is used to retrieve records that have been partitioned according to records from the specified parent streams. An example of a parent stream is automobile brands and the substream would be the various car models associated with each branch.":
    "connectorBuilder.cdkSchema.d.Substream_Partition_Router",
  "Path of the URL to use to validate that the session token is valid (do not include the base URL)":
    "connectorBuilder.cdkSchema.d.Validate_Session_Path",
  "Path of the field in config with selected authenticator name":
    "connectorBuilder.cdkSchema.d.Authenticator_Selection_Path",
  "Path of the login URL (do not include the base URL)": "connectorBuilder.cdkSchema.d.Login_Path",
  "Path to a nested array field within each record. Items from this array will be extracted and emitted as separate records. Supports wildcards (*) for matching multiple arrays.":
    "connectorBuilder.cdkSchema.d.Expand_Records_From_Field",
  "Path to the JSON file defining the schema. The path is relative to the connector module's root.":
    "connectorBuilder.cdkSchema.d.File_Path",
  "Prefix to add for object keys. If not provided original keys remain unchanged.":
    "connectorBuilder.cdkSchema.d.Key_Prefix",
  "Record extractor component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Record_Extractor",
  "Record extractor that searches a decoded response over a path defined as an array of fields.":
    "connectorBuilder.cdkSchema.d.Dpath_Extractor",
  "Record filter component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Record_Filter",
  "Record merge strategy that combines records according to fields on the record.":
    "connectorBuilder.cdkSchema.d.Group_by_Key",
  "Reference to the parent stream.": "connectorBuilder.cdkSchema.d.Parent_Stream",
  "Reference to the stream template.": "connectorBuilder.cdkSchema.d.Stream_Template",
  "Request body GraphQL query object": "connectorBuilder.cdkSchema.d.GraphQL_Query_Body",
  "Request body value converted into a GraphQL query object": "connectorBuilder.cdkSchema.d.GraphQL_Body",
  "Request body value converted into a JSON object": "connectorBuilder.cdkSchema.d.Json_Object_Body",
  "Request body value is converted into a url-encoded form": "connectorBuilder.cdkSchema.d.URL_encoded_Body",
  "Request body value is sent as plain text": "connectorBuilder.cdkSchema.d.Plain_text_Body",
  "Requester component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Requester",
  "Requester submitting HTTP requests and extracting records from the response.":
    "connectorBuilder.cdkSchema.d.HTTP_Requester",
  "Responsible for filtering fields to be added to json schema.": "connectorBuilder.cdkSchema.d.Schema_Filter",
  "Responsible for normalization according to the schema.": "connectorBuilder.cdkSchema.d.Schema_Normalization",
  "Responsible for translating an HTTP response into a list of records by extracting records from the response and optionally filtering records based on a heuristic.":
    "connectorBuilder.cdkSchema.d.Record_Selector",
  "Retriever component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Retriever",
  "Retrieves records by Asynchronously sending requests to fetch records. The retriever acts as an orchestrator between the requester, the record selector, the paginator, and the partition router.":
    "connectorBuilder.cdkSchema.d.Asynchronous_Retriever",
  "Retrieves records by synchronously sending requests to fetch records. The retriever acts as an orchestrator between the requester, the record selector, the paginator, and the partition router.":
    "connectorBuilder.cdkSchema.d.Synchronous_Retriever",
  "Return any non-auth headers. Authentication headers will overwrite any overlapping headers returned from this method.":
    "connectorBuilder.cdkSchema.d.Request_Headers",
  "Schema Loader component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Schema_Loader",
  "Schema normalization component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Schema_Normalization",
  "Secret used to sign the JSON web token.": "connectorBuilder.cdkSchema.d.Secret_Key",
  "Select 'CSV' for response data that is formatted as CSV (comma-separated values). Can specify an encoding (default: 'utf-8') and a delimiter (default: ',').":
    "connectorBuilder.cdkSchema.d.CSV",
  "Select 'Iterable' if the response consists of strings separated by new lines (`\\n`). The string will then be wrapped into a JSON object with the `record` key.":
    "connectorBuilder.cdkSchema.d.Iterable",
  "Select 'JSON Lines' if the response consists of JSON objects separated by new lines ('\\n') in JSONL format.":
    "connectorBuilder.cdkSchema.d.JSON_Lines",
  "Select 'JSON' if the response is formatted as a JSON object.": "connectorBuilder.cdkSchema.d.JSON",
  "Select 'XML' if the response consists of XML-formatted data.": "connectorBuilder.cdkSchema.d.XML",
  "Select 'ZIP file' for response data that is returned as a zipfile. Requires specifying an inner data type/decoder to parse the unzipped data.":
    "connectorBuilder.cdkSchema.d.ZIP_File",
  "Select 'gzip' for response data that is compressed with gzip. Requires specifying an inner data type/decoder to parse the decompressed data.":
    "connectorBuilder.cdkSchema.d.gzip",
  "Session token to use if using a pre-defined token. Not needed if authenticating with username + password pair":
    "connectorBuilder.cdkSchema.d.Session_Token",
  "Set to True if the target API does not accept queries where the start time equal the end time. This will cause those requests to be skipped.":
    "connectorBuilder.cdkSchema.d.Strict_Start_End_Time_Comparison",
  "Set to True if the target API endpoint does not take cursor values to filter records and returns all records anyway. This will cause the connector to filter out records locally, and only emit new records from the last sync, hence incremental. This means that all records would be read from the API, but only new records will be emitted to the destination.":
    "connectorBuilder.cdkSchema.d.Client_side_Incremental_Filtering",
  "Setting to True causes the connector to store the cursor as one value, instead of per-partition. This setting optimizes performance when the parent stream has thousands of partitions. Notably, the substream state is updated only at the end of the sync, which helps prevent data loss in case of a sync failure. See more info in the [docs](https://docs.airbyte.com/connector-development/config-based/understanding-the-yaml-file/incremental-syncs).":
    "connectorBuilder.cdkSchema.d.Global_Substream_Cursor",
  "Smallest increment the datetime_format has (ISO 8601 duration) that is used to ensure the start of a slice does not overlap with the end of the previous one, e.g. for %Y-%m-%d the granularity should\nbe P1D, for %Y-%m-%dT%H:%M:%SZ the granularity should be PT1S. Given this field is provided, `step` needs to be provided as well.\n  * **PT0.000001S**: 1 microsecond\n  * **PT0.001S**: 1 millisecond\n  * **PT1S**: 1 second\n  * **PT1M**: 1 minute\n  * **PT1H**: 1 hour\n  * **P1D**: 1 day\n":
    "connectorBuilder.cdkSchema.d.Cursor_Granularity",
  "Specification describing how an 'advanced' Auth flow would need to function.":
    "connectorBuilder.cdkSchema.d.OAuth_Config_Specification",
  "Specifies how to populate the body of the request with a JSON payload. Can contain nested objects.":
    "connectorBuilder.cdkSchema.d.Request_Body_JSON_Payload",
  "Specifies how to populate the body of the request with a non-JSON payload. Plain text will be sent as is, whereas objects will be converted to a urlencoded form.":
    "connectorBuilder.cdkSchema.d.Request_Body_Payload_Non_JSON",
  "Specifies how to populate the body of the request with a payload. Can contain nested objects.":
    "connectorBuilder.cdkSchema.d.Request_Body",
  "Specifies the OAuth2 grant type. If set to refresh_token, the refresh_token needs to be provided as well. For client_credentials, only client id and secret are required. Other grant types are not officially supported.":
    "connectorBuilder.cdkSchema.d.Grant_Type",
  "Specifies the query parameters that should be set on an outgoing HTTP request given the inputs.":
    "connectorBuilder.cdkSchema.d.Query_Parameters",
  "Specifies which parent streams are being iterated over and how parent records should be used to partition the child stream data set.":
    "connectorBuilder.cdkSchema.d.Parent_Stream_Configs",
  "Status Codes to Identify refresh token error in response (Refresh Token Error Key and Refresh Token Error Values should be also specified). Responses with one of the error status code and containing an error value will be flagged as a config error":
    "connectorBuilder.cdkSchema.d.Refresh_Token_Error_Status_Codes",
  "Strategy defining how records are paginated.": "connectorBuilder.cdkSchema.d.Pagination_Strategy",
  "Streams that are only available while performing a connector operation when the condition is met.":
    "connectorBuilder.cdkSchema.d.Conditional_Streams",
  "Streams that will be used during an operation based on the condition.": "connectorBuilder.cdkSchema.d.Streams",
  "Suffix to add for object keys. If not provided original keys remain unchanged.":
    "connectorBuilder.cdkSchema.d.Key_Suffix",
  "Template string evaluating when to stop paginating.": "connectorBuilder.cdkSchema.d.Stop_Condition",
  "The API key to inject in the request. Fill it in the user inputs.": "connectorBuilder.cdkSchema.d.API_Key",
  'The DeclarativeOAuth specific blob.\nPertains to the fields defined by the connector relating to the OAuth flow.\n\nInterpolation capabilities:\n- The variables placeholders are declared as `{{my_var}}`.\n- The nested resolution variables like `{{ {{my_nested_var}} }}` is allowed as well.\n\n- The allowed interpolation context is:\n  + base64Encoder - encode to `base64`, {{ {{my_var_a}}:{{my_var_b}} | base64Encoder }}\n  + base64Decorer - decode from `base64` encoded string, {{ {{my_string_variable_or_string_value}} | base64Decoder }}\n  + urlEncoder - encode the input string to URL-like format, {{ https://test.host.com/endpoint | urlEncoder}}\n  + urlDecorer - decode the input url-encoded string into text format, {{ urlDecoder:https%3A%2F%2Fairbyte.io | urlDecoder}}\n  + codeChallengeS256 - get the `codeChallenge` encoded value to provide additional data-provider specific authorisation values, {{ {{state_value}} | codeChallengeS256 }}\n\nExamples:\n  - The TikTok Marketing DeclarativeOAuth spec:\n  {\n    "oauth_connector_input_specification": {\n      "type": "object",\n      "additionalProperties": false,\n      "properties": {\n          "consent_url": "https://ads.tiktok.com/marketing_api/auth?{{client_id_key}}={{client_id_value}}&{{redirect_uri_key}}={{ {{redirect_uri_value}} | urlEncoder}}&{{state_key}}={{state_value}}",\n          "access_token_url": "https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/",\n          "access_token_params": {\n              "{{ auth_code_key }}": "{{ auth_code_value }}",\n              "{{ client_id_key }}": "{{ client_id_value }}",\n              "{{ client_secret_key }}": "{{ client_secret_value }}"\n          },\n          "access_token_headers": {\n              "Content-Type": "application/json",\n              "Accept": "application/json"\n          },\n          "extract_output": ["data.access_token"],\n          "client_id_key": "app_id",\n          "client_secret_key": "secret",\n          "auth_code_key": "auth_code"\n      }\n    }\n  }':
    "connectorBuilder.cdkSchema.d.DeclarativeOAuth_Connector_Specification",
  "The HTTP method to match (e.g., GET, POST).": "connectorBuilder.cdkSchema.d.Method",
  "The HTTP method used to fetch data from the source (can be GET or POST).":
    "connectorBuilder.cdkSchema.d.HTTP_Method",
  "The HTTP response header name that indicates the number of remaining allowed calls.":
    "connectorBuilder.cdkSchema.descExact.The_HTTP_response_header_name_that_indicates_the_n",
  "The HTTP response header name that indicates the number of remaining allowed calls.\n":
    "connectorBuilder.cdkSchema.descExact.The_HTTP_response_header_name_that_indicates_the_n",
  "The HTTP response header name that indicates when the rate limit resets.":
    "connectorBuilder.cdkSchema.descExact.The_HTTP_response_header_name_that_indicates_when",
  "The HTTP response header name that indicates when the rate limit resets.\n":
    "connectorBuilder.cdkSchema.descExact.The_HTTP_response_header_name_that_indicates_when",
  "The OAuth client ID. Fill it in the user inputs.": "connectorBuilder.cdkSchema.d.Client_ID",
  "The OAuth client secret. Fill it in the user inputs.": "connectorBuilder.cdkSchema.d.Client_Secret",
  "The URL of the source API endpoint. Do not put sensitive information (e.g. API tokens) into this field - Use the Authenticator component for this.":
    "connectorBuilder.cdkSchema.d.API_Endpoint_URL",
  "The URL path to be used for the HTTP request.": "connectorBuilder.cdkSchema.d.Request_Path",
  "The access token expiry date.": "connectorBuilder.cdkSchema.d.Token_Expiry_Date",
  "The amount of concurrency that will applied during a sync. This value can be hardcoded or user-defined in the config if different users have varying volume thresholds in the target API.":
    "connectorBuilder.cdkSchema.descExact.The_amount_of_concurrency_that_will_applied_during",
  "The amount of concurrency that will applied during a sync. This value can be hardcoded or user-defined in the config if different users have varying volume thresholds in the target API.\n":
    "connectorBuilder.cdkSchema.descExact.The_amount_of_concurrency_that_will_applied_during",
  "The amount of time in seconds a JWT token can be valid after being issued.":
    "connectorBuilder.cdkSchema.d.Token_Duration",
  "The authenticator being used to authenticate the client authenticator.":
    "connectorBuilder.cdkSchema.d.Profile_Assertion",
  "The base JSON schema against which the user-provided schema will be validated.":
    "connectorBuilder.cdkSchema.d.Base_JSON_Schema",
  'The base URL (scheme and host, e.g. "https://api.example.com") to match.': "connectorBuilder.cdkSchema.d.URL_Base",
  "The condition that the specified config value will be evaluated against":
    "connectorBuilder.cdkSchema.d.Validation_Strategy",
  "The data retention period of the incremental API (ISO8601 duration). If the cursor value is older than this retention period, the connector will automatically fall back to a full refresh to avoid data loss.\nThis is useful for APIs like Stripe Events API which only retain data for 30 days.\n* **PT1H**: 1 hour\n* **P1D**: 1 day\n* **P1W**: 1 week\n* **P1M**: 1 month\n* **P1Y**: 1 year\n* **P30D**: 30 days\n":
    "connectorBuilder.cdkSchema.d.API_Retention_Period",
  "The datetime format used to format the datetime values that are sent in outgoing requests to the API. Use placeholders starting with \"%\" to describe the format the API is using. The following placeholders are available:\n  * **%s**: Epoch unix timestamp - `1686218963`\n  * **%s_as_float**: Epoch unix timestamp in seconds as float with microsecond precision - `1686218963.123456`\n  * **%ms**: Epoch unix timestamp (milliseconds) - `1686218963123`\n  * **%a**: Weekday (abbreviated) - `Sun`\n  * **%A**: Weekday (full) - `Sunday`\n  * **%w**: Weekday (decimal) - `0` (Sunday), `6` (Saturday)\n  * **%d**: Day of the month (zero-padded) - `01`, `02`, ..., `31`\n  * **%b**: Month (abbreviated) - `Jan`\n  * **%B**: Month (full) - `January`\n  * **%m**: Month (zero-padded) - `01`, `02`, ..., `12`\n  * **%y**: Year (without century, zero-padded) - `00`, `01`, ..., `99`\n  * **%Y**: Year (with century) - `0001`, `0002`, ..., `9999`\n  * **%H**: Hour (24-hour, zero-padded) - `00`, `01`, ..., `23`\n  * **%I**: Hour (12-hour, zero-padded) - `01`, `02`, ..., `12`\n  * **%p**: AM/PM indicator\n  * **%M**: Minute (zero-padded) - `00`, `01`, ..., `59`\n  * **%S**: Second (zero-padded) - `00`, `01`, ..., `59`\n  * **%f**: Microsecond (zero-padded to 6 digits) - `000000`\n  * **%_ms**: Millisecond (zero-padded to 3 digits) - `000`\n  * **%z**: UTC offset - `(empty)`, `+0000`, `-04:00`\n  * **%Z**: Time zone name - `(empty)`, `UTC`, `GMT`\n  * **%j**: Day of the year (zero-padded) - `001`, `002`, ..., `366`\n  * **%U**: Week number of the year (starting Sunday) - `00`, ..., `53`\n  * **%W**: Week number of the year (starting Monday) - `00`, ..., `53`\n  * **%c**: Date and time - `Tue Aug 16 21:30:00 1988`\n  * **%x**: Date standard format - `08/16/1988`\n  * **%X**: Time standard format - `21:30:00`\n  * **%%**: Literal '%' character\n\n  Some placeholders depend on the locale of the underlying system - in most cases this locale is configured as en/US. For more information see the [Python documentation](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes).\n":
    "connectorBuilder.cdkSchema.d.Outgoing_Datetime_Format",
  "The datetime that determines the earliest record that should be synced.":
    "connectorBuilder.cdkSchema.d.Start_Datetime",
  "The datetime that determines the last record that should be synced. If not provided, `{{ now_utc() }}` will be used.":
    "connectorBuilder.cdkSchema.d.End_Datetime",
  "The duration in ISO 8601 duration notation after which the session token expires, starting from the time it was obtained. Omitting it will result in the session token being refreshed for every request.\n  * **PT1H**: 1 hour\n  * **P1D**: 1 day\n  * **P1W**: 1 week\n  * **P1M**: 1 month\n  * **P1Y**: 1 year\n":
    "connectorBuilder.cdkSchema.d.Expiration_Duration",
  "The dynamic stream name.": "connectorBuilder.cdkSchema.descExact.The_dynamic_stream_name",
  "The dynamic stream name.\n": "connectorBuilder.cdkSchema.descExact.The_dynamic_stream_name",
  "The format of the time to expiration datetime. Provide it if the time is returned as a date-time string instead of seconds.":
    "connectorBuilder.cdkSchema.d.Token_Expiry_Date_Format",
  "The full URL to call to obtain a new access token.": "connectorBuilder.cdkSchema.d.Token_Refresh_Endpoint",
  "The headers to match.": "connectorBuilder.cdkSchema.d.Headers",
  "The list of attributes being iterated over and used as input for the requests made to the source API.":
    "connectorBuilder.cdkSchema.d.Partition_Values",
  "The list of properties that should be included in every set of properties when multiple chunks of properties are being requested.":
    "connectorBuilder.cdkSchema.d.Always_Include_Properties",
  "The location of the value on a record that will be used as a bookmark during sync. To ensure no data loss, the API must return records in ascending order based on the cursor field. Nested fields are not supported, so the field must be at the top level of the record. You can use a combination of Add Field and Remove Field transformations to move the nested field to the top.":
    "connectorBuilder.cdkSchema.d.Cursor_Field",
  "The maximum amount of properties that can be retrieved per request according to the limit type.":
    "connectorBuilder.cdkSchema.d.Property_Limit",
  "The maximum level of concurrency that will be used during a sync. This becomes a required field when the default_concurrency derives from the config, because it serves as a safeguard against a user-defined threshold that is too high.":
    "connectorBuilder.cdkSchema.descExact.The_maximum_level_of_concurrency_that_will_be_used",
  "The maximum level of concurrency that will be used during a sync. This becomes a required field when the default_concurrency derives from the config, because it serves as a safeguard against a user-defined threshold that is too high.\n":
    "connectorBuilder.cdkSchema.descExact.The_maximum_level_of_concurrency_that_will_be_used",
  "The maximum number of calls allowed within the interval.": "connectorBuilder.cdkSchema.d.Limit",
  "The maximum number of calls allowed within the period.": "connectorBuilder.cdkSchema.d.Call_Limit",
  "The maximum number of time to retry a retryable request before giving up and failing.":
    "connectorBuilder.cdkSchema.d.Max_Retry_Count",
  "The name of the HTTP header that will be set to the API key. This setting is deprecated, use inject_into instead. Header and inject_into can not be defined at the same time.":
    "connectorBuilder.cdkSchema.d.Header_Name",
  "The name of the field on the record whose value will be used to group properties that were retrieved through multiple API requests.":
    "connectorBuilder.cdkSchema.d.Key",
  "The name of the property to use to refresh the `access_token`.":
    "connectorBuilder.cdkSchema.d.Client_ID_Property_Name",
  "The name of the property which contains the access token in the response from the token refresh endpoint.":
    "connectorBuilder.cdkSchema.d.Access_Token_Property_Name",
  "The name of the property which contains the expiry date in the response from the token refresh endpoint.":
    "connectorBuilder.cdkSchema.d.Token_Expiry_Property_Name",
  "The name of the response header defining how long to wait before retrying.":
    "connectorBuilder.cdkSchema.d.Response_Header",
  "The name of the session token header that will be injected in the request":
    "connectorBuilder.cdkSchema.d.Session_Request_Header",
  "The number of partitions to include in each group. This determines how many partition values are batched together in a single slice.":
    "connectorBuilder.cdkSchema.d.Group_Size",
  "The number of records to include in each pages.": "connectorBuilder.cdkSchema.d.Page_Size",
  "The number of streams to attempt reading from during a check operation. If `stream_count` exceeds the total number of available streams, the minimum of the two values will be used.":
    "connectorBuilder.cdkSchema.d.Stream_Count",
  "The partition router whose output will be grouped. This can be any valid partition router component.":
    "connectorBuilder.cdkSchema.d.Underlying_Partition_Router",
  "The password that will be combined with the username, base64 encoded and used to make requests. Fill it in the user inputs.":
    "connectorBuilder.cdkSchema.d.Password",
  "The path in the response body returned from the login requester to the session token.":
    "connectorBuilder.cdkSchema.d.Session_Token_Path",
  "The possible formats for the cursor field, in order of preference. The first format that matches the cursor field value will be used to parse it. If not provided, the Outgoing Datetime Format will be used.\nUse placeholders starting with \"%\" to describe the format the API is using. The following placeholders are available:\n  * **%s**: Epoch unix timestamp - `1686218963`\n  * **%s_as_float**: Epoch unix timestamp in seconds as float with microsecond precision - `1686218963.123456`\n  * **%ms**: Epoch unix timestamp - `1686218963123`\n  * **%a**: Weekday (abbreviated) - `Sun`\n  * **%A**: Weekday (full) - `Sunday`\n  * **%w**: Weekday (decimal) - `0` (Sunday), `6` (Saturday)\n  * **%d**: Day of the month (zero-padded) - `01`, `02`, ..., `31`\n  * **%b**: Month (abbreviated) - `Jan`\n  * **%B**: Month (full) - `January`\n  * **%m**: Month (zero-padded) - `01`, `02`, ..., `12`\n  * **%y**: Year (without century, zero-padded) - `00`, `01`, ..., `99`\n  * **%Y**: Year (with century) - `0001`, `0002`, ..., `9999`\n  * **%H**: Hour (24-hour, zero-padded) - `00`, `01`, ..., `23`\n  * **%I**: Hour (12-hour, zero-padded) - `01`, `02`, ..., `12`\n  * **%p**: AM/PM indicator\n  * **%M**: Minute (zero-padded) - `00`, `01`, ..., `59`\n  * **%S**: Second (zero-padded) - `00`, `01`, ..., `59`\n  * **%f**: Microsecond (zero-padded to 6 digits) - `000000`, `000001`, ..., `999999`\n  * **%_ms**: Millisecond (zero-padded to 3 digits) - `000`, `001`, ..., `999`\n  * **%z**: UTC offset - `(empty)`, `+0000`, `-04:00`\n  * **%Z**: Time zone name - `(empty)`, `UTC`, `GMT`\n  * **%j**: Day of the year (zero-padded) - `001`, `002`, ..., `366`\n  * **%U**: Week number of the year (Sunday as first day) - `00`, `01`, ..., `53`\n  * **%W**: Week number of the year (Monday as first day) - `00`, `01`, ..., `53`\n  * **%c**: Date and time representation - `Tue Aug 16 21:30:00 1988`\n  * **%x**: Date representation - `08/16/1988`\n  * **%X**: Time representation - `21:30:00`\n  * **%%**: Literal '%' character\n\n  Some placeholders depend on the locale of the underlying system - in most cases this locale is configured as en/US. For more information see the [Python documentation](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes).\n":
    "connectorBuilder.cdkSchema.d.Cursor_Datetime_Formats",
  "The prefix to be used within the Authentication header.": "connectorBuilder.cdkSchema.d.Header_Prefix",
  "The primary key of records from the parent stream that will be used during the retrieval of records for the current substream. This parent identifier field is typically a characteristic of the child records being extracted from the source API.":
    "connectorBuilder.cdkSchema.d.Parent_Key",
  "The query parameters to match.": "connectorBuilder.cdkSchema.d.Parameters",
  "The set of properties that will be queried for in the outbound request. This can either be statically defined or dynamic based on an API endpoint":
    "connectorBuilder.cdkSchema.d.Property_List",
  "The single top-level field to use as the primary key.": "connectorBuilder.cdkSchema.d.Single_Key",
  "The size of the time window (ISO8601 duration). Given this field is provided, `cursor_granularity` needs to be provided as well.\n  * **PT1H**: 1 hour\n  * **P1D**: 1 day\n  * **P1W**: 1 week\n  * **P1M**: 1 month\n  * **P1Y**: 1 year\n":
    "connectorBuilder.cdkSchema.d.Step",
  "The stream field to be used to distinguish unique records. Can either be a single field, an array of fields representing a composite key, or an array of arrays representing a composite key where the fields are nested fields.":
    "connectorBuilder.cdkSchema.d.Primary_Key",
  "The stream name.": "connectorBuilder.cdkSchema.d.Name",
  "The stream schemas representing the shape of the data emitted by the stream.":
    "connectorBuilder.cdkSchema.d.Schemas",
  "The time interval for the rate limit window.": "connectorBuilder.cdkSchema.d.Period",
  "The time interval for the rate limit.": "connectorBuilder.cdkSchema.d.Interval",
  "The type of auth to use": "connectorBuilder.cdkSchema.d.Auth_flow_type",
  "The type used to determine the maximum number of properties per chunk":
    "connectorBuilder.cdkSchema.d.Property_Limit_Type",
  "The username that will be combined with the password, base64 encoded and used to make requests. Fill it in the user inputs.":
    "connectorBuilder.cdkSchema.d.Username",
  "The value of the access_token to bypass the token refreshing using `refresh_token`.":
    "connectorBuilder.cdkSchema.d.Access_Token_Value",
  "The value that determines the earliest record that should be synced.": "connectorBuilder.cdkSchema.d.Start_Value",
  "The weight of a request matching this matcher when acquiring a call from the rate limiter. Different endpoints can consume different amounts from a shared budget by specifying different weights. If not set, each request counts as 1.\n":
    "connectorBuilder.cdkSchema.d.Weight",
  "This option is used to adjust the upper and lower boundaries of each datetime window to beginning and end of the provided target period (day, week, month)":
    "connectorBuilder.cdkSchema.d.Date_Range_Clamping",
  "Time interval (ISO8601 duration) before the start_datetime to read data for, e.g. P1M for looking back one month.\n  * **PT1H**: 1 hour\n  * **P1D**: 1 day\n  * **P1W**: 1 week\n  * **P1M**: 1 month\n  * **P1Y**: 1 year\n":
    "connectorBuilder.cdkSchema.d.Lookback_Window",
  "Token to inject as request header for authenticating with the API.": "connectorBuilder.cdkSchema.d.Bearer_Token",
  "Transformation component whose behavior is derived from a custom code implementation of the connector.":
    "connectorBuilder.cdkSchema.d.Custom_Transformation",
  "Transformation for object keys. If not provided, original key will be used.":
    "connectorBuilder.cdkSchema.d.Key_transformation",
  "Transformation that adds fields to a config. The path of the added field can be nested.":
    "connectorBuilder.cdkSchema.d.Config_Add_Fields",
  "Transformation that remaps a field's value to another value based on a static map.":
    "connectorBuilder.cdkSchema.d.Remap_Field",
  "Transformation that removes a field from the config.": "connectorBuilder.cdkSchema.d.Config_Remove_Fields",
  "Transformation which adds field to an output record. The path of the added field can be nested.":
    "connectorBuilder.cdkSchema.d.Add_Fields",
  'Transforms the input state for per-partitioned streams from the legacy format to the low-code format. The cursor field and partition ID fields are automatically extracted from the stream\'s DatetimebasedCursor and SubstreamPartitionRouter.\nExample input state: { "13506132": { "last_changed": "2022-12-27T08:34:39+00:00" } Example output state: { "partition": {"id": "13506132"}, "cursor": {"last_changed": "2022-12-27T08:34:39+00:00"} } ':
    "connectorBuilder.cdkSchema.d.Legacy_To_Per_partition_state_Migration",
  "Type of the value. If not specified, the type will be inferred from the value.":
    "connectorBuilder.cdkSchema.d.Value_Type",
  "URL of the connector's documentation page.": "connectorBuilder.cdkSchema.d.Documentation_URL",
  "Use this to implement custom decoder logic.": "connectorBuilder.cdkSchema.d.Custom_Decoder",
  "Used to iteratively execute requests over a set of values, such as a parent stream's records or a list of constant values.":
    "connectorBuilder.cdkSchema.d.Partition_Router",
  "Using the `offset` with value `0` during the first request":
    "connectorBuilder.cdkSchema.d.Inject_Offset_on_First_Request",
  "Using the `page number` with value defined by `start_from_page` during the first request":
    "connectorBuilder.cdkSchema.d.Inject_Page_Number_on_First_Request",
  "Validates that a user-provided schema adheres to a specified JSON schema.":
    "connectorBuilder.cdkSchema.d.Validate_Adheres_To_Schema",
  "Validator that applies a validation strategy to a specified value.":
    "connectorBuilder.cdkSchema.d.Predicate_Validator",
  "Validator that extracts the value located at a given field path.": "connectorBuilder.cdkSchema.d.Dpath_Validator",
  "Value of the cursor defining the next page to fetch.": "connectorBuilder.cdkSchema.d.Cursor_Value",
  "Value of the new field. Use {{ record['existing_field'] }} syntax to refer to other fields in the record.":
    "connectorBuilder.cdkSchema.d.Value",
  "Value of the predicate_key fields for the advanced auth to be applicable.":
    "connectorBuilder.cdkSchema.d.Predicate_value",
  "When configured, the JSON schema supplied in the catalog containing which columns are selected for the current stream will be used to reduce which query properties will be included in the outbound API request. This can improve the performance of API requests, especially for those requiring multiple requests to get a complete record.":
    "connectorBuilder.cdkSchema.d.Json_Schema_Property_Selector",
  'When set to true, the secret key will be base64 encoded prior to being encoded as part of the JWT. Only set to "true" when required by the API.':
    "connectorBuilder.cdkSchema.d.Base64_encode_Secret_Key",
  "When the refresh token updater is defined, new refresh tokens, access tokens and the access token expiry date are written back from the authentication response to the config object. This is important if the refresh token can only used once.":
    "connectorBuilder.cdkSchema.d.Refresh_Token_Updater",
  "Whether or not to prioritize parent parameters over component parameters when constructing dynamic streams. Defaults to true for backward compatibility.":
    "connectorBuilder.cdkSchema.d.Use_Parent_Parameters",
  "Whether the cursor allows users to override the default cursor_field when configuring their connection. The user defined cursor field will be specified from within the configured catalog.":
    "connectorBuilder.cdkSchema.d.Allow_Catalog_Defined_Cursor_Field",
  "Whether to delete the origin value or keep it. Default is False.":
    "connectorBuilder.cdkSchema.d.Delete_Origin_Value",
  "Whether to flatten lists or leave it as is. Default is True.": "connectorBuilder.cdkSchema.d.Flatten_Lists",
  "Whether to replace the origin record or not. Default is False.":
    "connectorBuilder.cdkSchema.d.Replace_Origin_Record",
  'While iterating over list values, the name of field used to reference a list value. The partition value can be accessed with string interpolation. e.g. "{{ stream_partition[\'my_key\'] }}" where "my_key" is the value of the cursor_field.':
    "connectorBuilder.cdkSchema.d.Current_Partition_Value_Identifier",
  "While iterating over parent records during a sync, the parent_key value can be referenced by using this field.":
    "connectorBuilder.cdkSchema.d.Current_Parent_Key_Value_Identifier",
};

const isChineseLocale = (locale: string) => locale.toLowerCase().startsWith("zh");

export function localizeCdkSchemaTitle(intl: IntlShape, title: string | undefined): string | undefined {
  if (!title || !isChineseLocale(intl.locale)) {
    return title;
  }
  const messageId = CDK_TITLE_MESSAGE_IDS[title];
  if (!messageId) {
    return title;
  }
  return intl.formatMessage({ id: messageId, defaultMessage: title });
}

export function localizeCdkSchemaDescription(intl: IntlShape, description: string | undefined): string | undefined {
  if (!description || !isChineseLocale(intl.locale)) {
    return description;
  }
  const normalized = description.replace(/\s+$/, "");
  const exact =
    CDK_DESCRIPTION_MESSAGE_IDS[description] ||
    CDK_DESCRIPTION_MESSAGE_IDS[normalized] ||
    CDK_DESCRIPTION_MESSAGE_IDS[`${normalized}\n`];
  if (exact) {
    return intl.formatMessage({ id: exact, defaultMessage: description });
  }
  for (const [en, messageId] of Object.entries(CDK_DESCRIPTION_MESSAGE_IDS)) {
    const enNorm = en.replace(/\s+$/, "");
    if (normalized.startsWith(enNorm.slice(0, 100)) || enNorm.startsWith(normalized.slice(0, 100))) {
      return intl.formatMessage({ id: messageId, defaultMessage: description });
    }
  }
  return description;
}
