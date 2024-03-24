#include <iostream>
using namespace std;

int n,st[25],i,j,a[20][20],start;

void initializare ()

{ cin>>n>>start;

for(i=1;i<=n;i++)

for(j=1;j<=n;j++)

a[i][j]=0;

for(i=1;i<=25;i++) st[i]=0;

for(i=1;i<=n;i++)

for(j=1;j<=n;j++)

cin>>a[i][j];

st[1]=start; }

void tiparire (int p)

{ for(i=1;i<=p;i++)

{cout<<st[i]<<" ";

cout<<endl;}

int validare (int p)

{for(i=1;i<=p;i++)

cout<<st[i]; }

{for(i=1;i<=n;i++)

if (st[p]=st[i]) return 0;

if (a[st[p]][st[p-1]]==0) return 0;

return 1; }

void back (int p)

{int val;

for( val=1; val<=n; val++)

{st[p]=val;

if (validare(p))

if(p==n && a[st[n]][start]==1)

tiparire(p);

else back(p+1);}}

int main ()

{i nitializare ()

back(2);

return 0;}



Citește mai mult: https://backtracking0.webnode.ro/products/problema-comisului-voiajor/