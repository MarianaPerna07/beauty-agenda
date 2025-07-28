# Security Group for EC2 instances
resource "aws_security_group" "ec2" {
  name_prefix = "ec2-sg-"
  vpc_id      = aws_vpc.main.id

  # Allow all inbound traffic
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "EC2SecurityGroup"
  }
}

resource "aws_instance" "frontend" {
  count             = 1
  ami               = "ami-042b4708b1d05f512"  # replace with your preferred AMI ID
  instance_type     = "t3.small"
  subnet_id         = aws_subnet.public.id
  key_name          = "ec2-key"
  associate_public_ip_address = true

  # Attach the security group
  vpc_security_group_ids = [aws_security_group.ec2.id]

  # Define the storage
  root_block_device {
    volume_size = 20
    volume_type = "gp2"
  }

  tags = {
    Name = "FrontendEC2Instance-1"
  }
}




