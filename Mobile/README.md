# This dir is for the mobile app src code

### How to generate build

#### here are the steps

- Clean Gradle cache and ensure the project is fresh
```bash
./gradlew clean
```

- Start the React Native server to check for any issues
```bash
npx react-native start
```

- Run the React Native Doctor to check your environment setup
```bash
npx react-native doctor
```

- Automatically fix security vulnerabilities and dependency issues
```bash
npm audit fix
```

- Move to Android Dir

- You have two options to generate build

- Build the APK using React Native CLI
```bash
npx react-native build-android
```

- Build the release APK using Gradle
```bash
./gradlew assemblerelease
```