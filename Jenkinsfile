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

                        echo "Generated .env file:"
                        cat .env
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
                script {
                    echo "⏳ Waiting for API service on port 4000..."

                    def retries = 12   // 12 ครั้ง × 5 วิ = 60 วินาที
                    def healthy = false

                    for (int i = 1; i <= retries; i++) {

                        echo "➡️  Attempt ${i}/${retries}..."

                        def status = sh(
                            script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:4000/health || true",
                            returnStdout: true
                        ).trim()

                        if (status == "200") {
                            echo "✅ API is healthy! (HTTP 200)"
                            healthy = true
                            break
                        } else {
                            echo "❌ API not ready yet (HTTP ${status})"
                            sleep 5
                        }
                    }

                    if (!healthy) {
                        error("❌ API failed to pass health check within timeout")
                    }
                }
            }
        }
    }
}
