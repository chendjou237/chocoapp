import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { SignOutButton } from '~/components/SignOutButton';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

const GITHUB_AVATAR_URI =
  'https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 p-4 bg-secondary/30">
      <View className="mb-4">
        <Text className="text-2xl font-bold">Profile</Text>
        <Text className="text-muted-foreground">Manage your account settings</Text>
      </View>

      <Card className="mb-4">
        <CardHeader className="items-center">
          <Avatar alt="Rick Sanchez's Avatar" className="mb-4 w-24 h-24">
            <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
            <AvatarFallback>
              <Text>RS</Text>
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">Rick Sanchez</CardTitle>
          <Text className="text-muted-foreground">scientist@dimension-c137.com</Text>
        </CardHeader>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="space-y-4">
            <View className="flex-row justify-between items-center p-3 border-b border-border">
              <Text className="font-medium">Email Notifications</Text>
              <Text className="text-sm text-green-600">Enabled</Text>
            </View>
            <View className="flex-row justify-between items-center p-3 border-b border-border">
              <Text className="font-medium">Two-Factor Authentication</Text>
              <Text className="text-sm text-red-600">Disabled</Text>
            </View>
            <View className="flex-row justify-between items-center p-3">
              <Text className="font-medium">Account Type</Text>
              <Text className="text-sm">Premium</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="items-center py-4">
          <SignOutButton />
        </CardContent>
      </Card>
    </ScrollView>
  );
}
