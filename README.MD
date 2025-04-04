Terraform command to start Devlopment Environment :-

        terraform apply -var-file="dev.tfvars"

Terraform command to start Staging Environement :-

        terraform apply -var-file="staging.tfvars"

Terraform command to start Production Environment :-

        terraform apply -var-file="prod.tfvars"



You can change the port of frontend and backend according to environment by,
just Go to

/terraform/environments/dev.tfvars           # for development
           
/terraform/environments/staging.tfvars       # for staging
           
/terraform/environments/prod.tfvars          # for production
 
