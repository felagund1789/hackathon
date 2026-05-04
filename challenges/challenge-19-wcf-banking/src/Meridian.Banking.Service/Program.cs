using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Meridian.Banking.Service.Contracts;
using Meridian.Banking.Service.Data;
using Meridian.Banking.Service.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();
builder.Services.AddSingleton<BankDataStore>();
builder.Services.AddSingleton<AccountServiceImpl>();
builder.Services.AddSingleton<LoanServiceImpl>();
builder.Services.AddSingleton<TransactionServiceImpl>();

var app = builder.Build();

app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder
        .AddService<AccountServiceImpl>(s => s.DebugBehavior.IncludeExceptionDetailInFaults = true)
        .AddServiceEndpoint<AccountServiceImpl, IAccountService>(new BasicHttpBinding(), "/AccountService");

    serviceBuilder
        .AddService<LoanServiceImpl>(s => s.DebugBehavior.IncludeExceptionDetailInFaults = true)
        .AddServiceEndpoint<LoanServiceImpl, ILoanService>(new BasicHttpBinding(), "/LoanService");

    serviceBuilder
        .AddService<TransactionServiceImpl>(s => s.DebugBehavior.IncludeExceptionDetailInFaults = true)
        .AddServiceEndpoint<TransactionServiceImpl, ITransactionService>(new BasicHttpBinding(), "/TransactionService");
});

var serviceMetadataBehavior = app.Services.GetRequiredService<ServiceMetadataBehavior>();
serviceMetadataBehavior.HttpGetEnabled = true;

Console.WriteLine("Meridian Savings Bank -- WCF Service");
Console.WriteLine("Endpoints:");
Console.WriteLine("  http://localhost:5000/AccountService");
Console.WriteLine("  http://localhost:5000/LoanService");
Console.WriteLine("  http://localhost:5000/TransactionService");

app.Run();
