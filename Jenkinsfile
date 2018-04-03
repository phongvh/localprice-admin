node {
    stage('Build') {
        sh 'echo "Hello World"'
        sh '''
            echo "Multiline shell steps works too"
            ls -lah
        '''
	sh 'npm install'
	sh 'npm start'
    }
}

