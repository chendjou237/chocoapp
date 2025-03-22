import * as React from 'react';
import { FlatList, Image, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import type { ReceiptRecord } from '~/lib/types';
import { supabase } from '~/lib/utils';

export default function HistoryScreen() {
  const [receipts, setReceipts] = React.useState<ReceiptRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('rbm_records')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceipts(data);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-background">
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Receipt #{item.id.slice(0, 8)}</CardTitle>
              <Text className="text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </CardHeader>
            <CardContent>
              <View className="overflow-hidden mb-2 h-40 rounded-lg bg-muted">
                <Image
                  source={{ uri: item.image_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-lg font-semibold">
                Total: ${item.total.toFixed(2)}
              </Text>
            </CardContent>
          </Card>
        )}
      />
    </View>
  );
}
