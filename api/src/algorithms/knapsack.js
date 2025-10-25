export function optimizarLista(productos, presupuesto) {
  const n = productos.length;
  const dp = Array(n + 1).fill(null).map(() => Array(presupuesto + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const { precio, score } = productos[i - 1];
    for (let w = 0; w <= presupuesto; w++) {
      if (precio <= w)
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - precio] + score);
      else dp[i][w] = dp[i - 1][w];
    }
  }
  return dp[n][presupuesto];
}