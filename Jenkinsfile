pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Env') {
            steps {
                withCredentials([
                    string(credentialsId: 'POSTGRES_USER', variable: 'POSTGRES_USER'),
                    string(credentialsId: 'POSTGRES_PASSWORD', variable: 'POSTGRES_PASSWORD'),
                    string(credentialsId: 'POSTGRES_DB', variable: 'POSTGRES_DB'),
                    string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL'),
                    string(credentialsId: 'API_PORT', variable: 'API_PORT')
                ]) {
                    sh '''
                        echo "POSTGRES_USER=$POSTGRES_USER" > .env
                        echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env
                        echo "POSTGRES_DB=$POSTGRES_DB" >> .env
                        echo "DATABASE_URL=$DATABASE_URL" >> .env
                        echo "PORT=$API_PORT" >> .env
                        echo "NODE_ENV=production" >> .env
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    for i in {1..10}; do
                        if curl -f http://localhost:4000/health; then 
                            echo "Service healthy!"
                            exit 0
                        fi
                        echo "Waiting for API..."
                        sleep 3
                    done
                    exit 1
                '''
            }
        }
    }
}
