import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { supabase } from '~/lib/utils';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        

      });

      if (error) throw error;
      Alert.alert('Success', 'Check your email for the confirmation link');
    } catch (error) {
      Alert.alert('Error', `${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center items-center p-6 bg-background">
      <Card className="w-full max-w-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <View className="space-y-2">
            <Text className="text-sm font-medium">Email</Text>
            <TextInput
              className="px-3 py-2 h-10 text-sm rounded-md border border-input bg-background"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View className="space-y-2">
            <Text className="text-sm font-medium">Password</Text>
            <TextInput
              className="px-3 py-2 h-10 text-sm rounded-md border border-input bg-background"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <Button
            className="w-full"
            onPress={signUpWithEmail}
            disabled={loading}
          >
            <Text className="text-primary-foreground">
              {loading ? 'Loading...' : 'Sign Up'}
            </Text>
          </Button>
          <View className="flex-row justify-center">
            <Text className="text-sm text-muted-foreground">Already have an account? </Text>
            <Link href="/(auth)/sign-in">
              <Text className="text-sm font-medium text-primary">Sign In</Text>
            </Link>
          </View>
        </CardFooter>
      </Card>
    </View>
  );
}
