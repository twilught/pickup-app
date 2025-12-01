pipeline {
    agent any
    triggers { pollSCM('* * * * *') }
    stages {
        stage('Checkout'){steps{checkout scm}}
        stage('Build'){steps{sh 'docker compose build'}}
        stage('Deploy'){steps{sh 'docker compose down'; sh 'docker compose up -d'}}
        stage('Health Check'){steps{sh '''
          for i in {1..10}; do
            if curl --fail http://localhost:4000/health; then exit 0; fi
            sleep 3
          done
          exit 1
        '''}}
    }
}