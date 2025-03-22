import { router } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { SignOutButton } from '~/components/SignOutButton';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/lib/useAuth';
import { formatCurrency } from '~/lib/utils/currency';

const GITHUB_AVATAR_URI =
  'https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg';

export default function ProfileScreen() {
  const { user } = useAuth();
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : '';

  return (
    <ScrollView className="flex-1 p-4 bg-secondary/30">
      <View className="mb-4">
        <Text className="text-2xl font-bold">Profile</Text>
        <Text className="text-muted-foreground">Manage your account settings</Text>
      </View>

      <Card className="mb-4">
        <CardHeader className="items-center">
          <Avatar alt={`${user?.email}'s Avatar`} className="mb-4 w-24 h-24">
            <AvatarImage source={{ uri: user?.user_metadata?.avatar_url }} />
            <AvatarFallback>
              <Text>{userInitials}</Text>
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{user?.user_metadata?.full_name || user?.email}</CardTitle>
          <Text className="text-muted-foreground">{user?.email}</Text>
        </CardHeader>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Today's Financial Objective</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="space-y-4">
            <View className="flex-row justify-between items-center">
              <Text className="font-medium">Daily Revenue Goal</Text>
              <Text className="text-sm">{formatCurrency(10000)}</Text>
            </View>
            <Progress
              value={75}
              className="h-2"
              indicatorClassName="bg-green-600"
            />
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-muted-foreground">Current: {formatCurrency(7500)}</Text>
              <Text className="text-sm text-muted-foreground">75% Complete</Text>
            </View>
            <Button
              onPress={() => router.push('/objectives-history')}
              variant="outline"
              className="w-full"

            ><Text>
              View Objectives History
            </Text>
            </Button>
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
