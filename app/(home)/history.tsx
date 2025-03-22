import * as React from 'react';
import { FlatList, Image, RefreshControl, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import type { ReceiptRecord } from '~/lib/types';
import { supabase } from '~/lib/utils';
import { formatCurrency } from '~/lib/utils/currency';

export default function HistoryScreen() {
  const [receipts, setReceipts] = React.useState<ReceiptRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('rbms_records')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_date', { ascending: false });

      if (error) throw error;
      setReceipts(data);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchReceipts();
  }, []);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Receipt #{item.id}</CardTitle>
              <Text className="text-sm text-muted-foreground">
                {new Date(item.created_date).toLocaleDateString()}
              </Text>
            </CardHeader>
            <CardContent>
              <View className="overflow-hidden mb-2 h-40 rounded-lg bg-muted">
                <Image
                  src={item.picture}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-lg font-semibold">
                Total: {formatCurrency(item.total)}
              </Text>
            </CardContent>
          </Card>
        )}
      />
    </View>
  );
}
