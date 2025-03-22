import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

export default function InvoiceScreen() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 p-4 bg-secondary/30">
      <View className="mb-4">
        <Text className="text-2xl font-bold">Invoices</Text>
        <Text className="text-muted-foreground">Manage your billing and payments</Text>
      </View>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="space-y-2">
            {[1, 2, 3].map((item) => (
              <View key={item} className="flex-row justify-between items-center p-3 border-b border-border">
                <View>
                  <Text className="font-medium">Invoice #{item}0001</Text>
                  <Text className="text-sm text-muted-foreground">Due {30 - (item * 7)} days</Text>
                </View>
                <Text className="font-semibold">${item * 199}.00</Text>
              </View>
            ))}
          </View>
        </CardContent>
        <CardFooter>
          <Text className="text-sm text-muted-foreground">Showing 3 of 12 invoices</Text>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="space-y-2">
            <View className="flex-row justify-between items-center p-3 border-b border-border">
              <Text className="font-medium">Credit Card ending in 4242</Text>
              <Text className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded">Default</Text>
            </View>
            <View className="flex-row justify-between items-center p-3">
              <Text className="font-medium">PayPal account</Text>
              <Text className="text-sm">Connected</Text>
            </View>
          </View>
        </CardContent>
      </Card>
      <TouchableOpacity
        onPress={() => router.push('/invoice/create')}
        className="absolute right-4 bottom-4 justify-center items-center w-14 h-14 rounded-full shadow-lg bg-primary"
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}
