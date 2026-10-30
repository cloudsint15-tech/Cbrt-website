import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";

const COLORS = {
  navy: "#071B35",
  blue: "#1455A0",
  gold: "#D9AF55",
  white: "#FFFFFF",
  background: "#F3F6FA",
  text: "#17263C",
  muted: "#718096",
  border: "#E0E6EF",
  green: "#138A58",
  red: "#C93B45",
};

const WALLETS = [
  {
    name: "USDT",
    network: "TRON (TRC20)",
    address: "TJjsxDoAKBxKTccQdudnG84L9DUvkxKyYy",
  },
  {
    name: "BNB",
    network: "BNB Smart Chain (BEP20)",
    address: "0x720Ad18718f05C1DFA66Ce717d1FD604013E9d3e",
  },
  {
    name: "SOL",
    network: "Solana",
    address: "Bbkp3EH4Upg33uq47JgXr1J3VSeF6Mj87cqfdJfQzaqj",
  },
  {
    name: "ETH",
    network: "Ethereum (ERC20)",
    address: "0x720Ad18718f05C1DFA66Ce717d1FD604013E9d3e",
  },
  {
    name: "BTC",
    network: "Bitcoin",
    address: "bc1qd5r8aujxjcmp78lzj06srlt0yhw05cpap8vu0k",
  },
];

const PLANS = [
  { name: "STARTER", min: 100, max: 499, color: "#5D8AC5" },
  { name: "SILVER", min: 500, max: 1999, color: "#7B8797" },
  { name: "GOLD", min: 2000, max: 4999, color: "#C79B35" },
  { name: "PLATINUM", min: 5000, max: 9999, color: "#657D9A" },
  { name: "PREMIUM", min: 10000, max: 24999, color: "#7860B5" },
  { name: "ELITE", min: 25000, max: 100000, color: "#B27B3E" },
];

export default function App() {
  const [screen, setScreen] = useState("auth");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState("");
  const [selectedWallet, setSelectedWallet] = useState(WALLETS[0]);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [transactions, setTransactions] = useState([]);

  const money = (value) =>
    "$" + Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const notifyBackend = () => {
    Alert.alert(
      "Account Verification Required",
      "This interface needs a secure backend to authenticate accounts and verify financial transactions. No funds have been moved."
    );
  };

  const handleAuth = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Enter your email and password.");
      return;
    }

    if (authMode === "signup" && !fullName.trim()) {
      Alert.alert("Missing Information", "Enter your full name.");
      return;
    }

    notifyBackend();
  };

  const logout = () => {
    setUser(null);
    setScreen("auth");
    setAuthMode("login");
    setPassword("");
  };

  const addTransaction = (type, value, status = "Pending") => {
    const item = {
      id: Date.now().toString(),
      type,
      amount: Number(value),
      status,
      date: new Date().toLocaleDateString(),
    };

    setTransactions((previous) => [item, ...previous]);
  };

  const submitDeposit = () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      Alert.alert("Invalid Amount", "Enter a valid deposit amount.");
      return;
    }

    Alert.alert(
      "Deposit Verification Required",
      "A secure backend is required to verify deposits. Do not assume a deposit has been credited until independently confirmed."
    );
  };

  const submitWithdrawal = () => {
    const value = Number(amount);

    if (!value || value <= 0 || !withdrawAddress.trim()) {
      Alert.alert(
        "Check Details",
        "Enter a valid withdrawal amount and destination address."
      );
      return;
    }

    Alert.alert(
      "Withdrawal Verification Required",
      "Withdrawals require secure account verification and a connected backend. No withdrawal has been processed."
    );
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.brand}
        onPress={() => setScreen(user ? "dashboard" : "auth")}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <View>
          <Text style={styles.brandName}>CBRE</Text>
          <Text style={styles.brandSub}>INVESTMENT PORTAL</Text>
        </View>
      </TouchableOpacity>

      {user && (
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const Button = ({ title, onPress, secondary }) => (
    <TouchableOpacity
      style={[styles.button, secondary && styles.secondaryButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const Field = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    multiline,
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#9AA5B5"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || "default"}
        autoCapitalize="none"
        multiline={multiline}
      />
    </View>
  );

  const NavButton = ({ title, target }) => (
    <TouchableOpacity
      style={[
        styles.navButton,
        screen === target && styles.navButtonActive,
      ]}
      onPress={() => setScreen(target)}
    >
      <Text
        style={[
          styles.navButtonText,
          screen === target && styles.navButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const AuthScreen = () => (
    <ScrollView contentContainerStyle={styles.authPage}>
      <View style={styles.authHero}>
        <View style={styles.bigLogo}>
          <Text style={styles.bigLogoText}>C</Text>
        </View>
        <Text style={styles.heroTitle}>CBRE</Text>
        <Text style={styles.heroSubtitle}>
          Your investment portal
        </Text>
        <Text style={styles.heroDescription}>
          Access your account and explore available investment plans.
        </Text>
      </View>

      <View style={styles.authCard}>
        <Text style={styles.cardTitle}>
          {authMode === "login" ? "Welcome Back" : "Create Account"}
        </Text>
        <Text style={styles.mutedText}>
          {authMode === "login"
            ? "Sign in to continue."
            : "Enter your details to get started."}
        </Text>

        {authMode === "signup" && (
          <Field
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
          />
        )}

        <Field
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />

        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button
          title={authMode === "login" ? "Sign In" : "Create Account"}
          onPress={handleAuth}
        />

        <TouchableOpacity
          style={styles.switchAuth}
          onPress={() =>
            setAuthMode(authMode === "login" ? "signup" : "login")
          }
        >
          <Text style={styles.switchAuthText}>
            {authMode === "login"
              ? "New here? Create an account"
              : "Already registered? Sign in"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerNote}>
        Secure account authentication must be connected before this
        interface can manage real accounts or money.
      </Text>
    </ScrollView>
  );

  const Dashboard = () => (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.welcomeBlock}>
        <Text style={styles.welcomeSmall}>ACCOUNT OVERVIEW</Text>
        <Text style={styles.welcomeTitle}>
          Welcome{user?.name ? `, ${user.name}` : ""}
        </Text>
        <Text style={styles.mutedText}>
          Review your account and available services.
        </Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>ACCOUNT BALANCE</Text>
        <Text style={styles.balanceAmount}>{money(0)}</Text>
        <Text style={styles.balanceCaption}>
          No live account balance is connected.
        </Text>

        <View style={styles.balanceActions}>
          <TouchableOpacity
            style={styles.balanceAction}
            onPress={() => {
              setAmount("");
              setScreen("deposit");
            }}
          >
            <Text style={styles.balanceActionText}>＋ Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.balanceAction}
            onPress={() => {
              setAmount("");
              setScreen("withdraw");
            }}
          >
            <Text style={styles.balanceActionText}>↗ Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => setScreen("plans")}
        >
          <Text style={styles.quickIcon}>◇</Text>
          <Text style={styles.quickTitle}>Investment Plans</Text>
          <Text style={styles.quickSubtitle}>Explore plan ranges</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => setScreen("wallets")}
        >
          <Text style={styles.quickIcon}>₿</Text>
          <Text style={styles.quickTitle}>Crypto Wallets</Text>
          <Text style={styles.quickSubtitle}>View wallet details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => setScreen("transactions")}
        >
          <Text style={styles.quickIcon}>▤</Text>
          <Text style={styles.quickTitle}>Transactions</Text>
          <Text style={styles.quickSubtitle}>View activity</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => setScreen("deposit")}
        >
          <Text style={styles.quickIcon}>＋</Text>
          <Text style={styles.quickTitle}>Make a Deposit</Text>
          <Text style={styles.quickSubtitle}>Open deposit form</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Important Information</Text>
        <Text style={styles.noticeText}>
          Investment returns are not guaranteed. Verify the identity,
          registration, fees, and terms of any investment provider before
          sending money.
        </Text>
      </View>
    </ScrollView>
  );

  const PlansScreen = () => (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.pageTitle}>Investment Plans</Text>
      <Text style={styles.mutedText}>
        Browse the configured investment amount ranges.
      </Text>

      {PLANS.map((plan) => (
        <View key={plan.name} style={styles.planCard}>
          <View
            style={[styles.planAccent, { backgroundColor: plan.color }]}
          />
          <View style={styles.planContent}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planRange}>
              {money(plan.min)} – {money(plan.max)}
            </Text>
            <Text style={styles.planDescription}>
              Investment amount range
            </Text>
            <Button
              title="Select Plan"
              onPress={() => {
                setSelectedPlan(plan);
                setAmount("");
                setScreen("deposit");
              }}
            />
          </View>
        </View>
      ))}

      <Text style={styles.footerNote}>
        These ranges do not guarantee profit or represent a verified
        investment offer.
      </Text>
    </ScrollView>
  );

  const WalletsScreen = () => (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.pageTitle}>Crypto Wallets</Text>
      <Text style={styles.mutedText}>
        Wallet addresses configured in this app.
      </Text>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Verify Before Sending</Text>
        <Text style={styles.noticeText}>
          Confirm that each address belongs to the intended recipient and
          that the network is correct. Crypto transfers may be irreversible.
        </Text>
      </View>

      {WALLETS.map((wallet) => (
        <View key={wallet.name} style={styles.walletCard}>
          <View style={styles.walletTop}>
            <View style={styles.walletCoin}>
              <Text style={styles.walletCoinText}>{wallet.name}</Text>
            </View>
            <View style={styles.walletInfo}>
              <Text style={styles.walletName}>{wallet.name}</Text>
              <Text style={styles.walletNetwork}>{wallet.network}</Text>
            </View>
          </View>

          <Text style={styles.addressLabel}>WALLET ADDRESS</Text>
          <Text selectable style={styles.walletAddress}>
            {wallet.address}
          </Text>

          <Button
            title="Use This Wallet"
            secondary
            onPress={() => {
              setSelectedWallet(wallet);
              setScreen("deposit");
            }}
          />
        </View>
      ))}
    </ScrollView>
  );

  const DepositScreen = () => (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.pageTitle}>Deposit</Text>
      <Text style={styles.mutedText}>
        Submit details for verification once a secure backend is connected.
      </Text>

      {selectedPlan && (
        <View style={styles.selectedPlanBox}>
          <Text style={styles.selectedPlanLabel}>SELECTED PLAN</Text>
          <Text style={styles.selectedPlanName}>
            {selectedPlan.name}
          </Text>
          <Text style={styles.mutedText}>
            {money(selectedPlan.min)} – {money(selectedPlan.max)}
          </Text>
        </View>
      )}

      <View style={styles.formCard}>
        <Field
          label="Deposit Amount (USD)"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
        />

        <Text style={styles.fieldLabel}>Select Cryptocurrency</Text>

        {WALLETS.map((wallet) => (
          <TouchableOpacity
            key={wallet.name}
            style={[
              styles.walletOption,
              selectedWallet.name === wallet.name &&
                styles.walletOptionActive,
            ]}
            onPress={() => setSelectedWallet(wallet)}
          >
            <View>
              <Text style={styles.walletOptionName}>{wallet.name}</Text>
              <Text style={styles.walletOptionNetwork}>
                {wallet.network}
              </Text>
            </View>
            <Text style={styles.radio}>
              {selectedWallet.name === wallet.name ? "●" : "○"}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.addressBox}>
          <Text style={styles.addressLabel}>PAYMENT ADDRESS</Text>
          <Text selectable style={styles.walletAddress}>
            {selectedWallet.address}
          </Text>
        </View>

        <Button title="Submit Deposit for Verification" onPress={submitDeposit} />

        <Text style={styles.footerNote}>
          This button does not transfer funds or confirm payment.
        </Text>
      </View>
    </ScrollView>
  );

  const WithdrawScreen = () => (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.pageTitle}>Withdraw Funds</Text>
      <Text style={styles.mutedText}>
        Withdrawal requests require verified account access.
      </Text>

      <View style={styles.formCard}>
        <Field
          label="Withdrawal Amount (USD)"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
        />

        <Text style={styles.fieldLabel}>Withdrawal Network</Text>

        {WALLETS.map((wallet) => (
          <TouchableOpacity
            key={wallet.name}
            style={[
              styles.walletOption,
              selectedWallet.name === wallet.name &&
                styles.walletOptionActive,
            ]}
            onPress={() => setSelectedWallet(wallet)}
          >
            <View>
              <Text style={styles.walletOptionName}>{wallet.name}</Text>
              <Text style={styles.walletOptionNetwork}>
                {wallet.network}
              </Text>
            </View>
            <Text style={styles.radio}>
              {selectedWallet.name === wallet.name ? "●" : "○"}
            </Text>
          </TouchableOpacity>
        ))}

        <Field
          label="Your Destination Wallet Address"
          value={withdrawAddress}
          onChangeText={setWithdrawAddress}
          placeholder="Enter destination address"
          multiline
        />

        <Button title="Submit Withdrawal Request" onPress={submitWithdrawal} />

        <Text style={styles.footerNote}>
          No withdrawal will be processed by this frontend alone.
        </Text>
      </View>
    </ScrollView>
  );

  const TransactionsScreen = () => (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.pageTitle}>Transaction History</Text>
      <Text style={styles.mutedText}>
        Transaction records available in this app session.
      </Text>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>▤</Text>
          <Text style={styles.emptyTitle}>No Transactions Yet</Text>
          <Text style={styles.mutedText}>
            Verified transactions will appear here when a backend is
            connected.
          </Text>
        </View>
      ) : (
        transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionTop}>
              <Text style={styles.transactionType}>
                {transaction.type}
              </Text>
              <Text style={styles.transactionAmount}>
                {money(transaction.amount)}
              </Text>
            </View>
            <Text style={styles.transactionDate}>
              {transaction.date}
            </Text>
            <Text style={styles.transactionStatus}>
              Status: {transaction.status}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderScreen = () => {
    if (!user) return <AuthScreen />;

    switch (screen) {
      case "dashboard":
        return <Dashboard />;
      case "plans":
        return <PlansScreen />;
      case "wallets":
        return <WalletsScreen />;
      case "deposit":
        return <DepositScreen />;
      case "withdraw":
        return <WithdrawScreen />;
      case "transactions":
        return <TransactionsScreen />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <Header />

      {user && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navBar}
          contentContainerStyle={styles.navContent}
        >
          <NavButton title="Home" target="dashboard" />
          <NavButton title="Plans" target="plans" />
          <NavButton title="Wallets" target="wallets" />
          <NavButton title="Deposit" target="deposit" />
          <NavButton title="Withdraw" target="withdraw" />
          <NavButton title="History" target="transactions" />
        </ScrollView>
      )}

      <View style={styles.content}>{renderScreen()}</View>

      <View style={styles.bottomBar}>
        <Text style={styles.bottomBrand}>CBRE</Text>
        <Text style={styles.bottomText}>
          Investment Portal • Secure access required
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.navy,
    minHeight: 76,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  logoText: {
    color: COLORS.navy,
    fontSize: 27,
    fontWeight: "900",
  },

  brandName: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  brandSub: {
    color: COLORS.gold,
    fontSize: 9,
    letterSpacing: 1.4,
    marginTop: 2,
  },

  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#53657D",
    borderRadius: 8,
  },

  logoutText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  content: {
    flex: 1,
  },

  navBar: {
    flexGrow: 0,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  navContent: {
    paddingHorizontal: 8,
    alignItems: "center",
  },

  navButton: {
    paddingHorizontal: 13,
    paddingVertical: 14,
    marginHorizontal: 2,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },

  navButtonActive: {
    borderBottomColor: COLORS.gold,
  },

  navButtonText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
  },

  navButtonTextActive: {
    color: COLORS.navy,
  },

  page: {
    padding: 18,
    paddingBottom: 32,
  },

  authPage: {
    padding: 18,
    paddingBottom: 35,
  },

  authHero: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 25,
  },

  bigLogo: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  bigLogoText: {
    fontSize: 49,
    fontWeight: "900",
    color: COLORS.navy,
  },

  heroTitle: {
    color: COLORS.navy,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 4,
  },

  heroSubtitle: {
    fontSize: 15,
    color: COLORS.blue,
    marginTop: 6,
    fontWeight: "700",
  },

  heroDescription: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 12,
    maxWidth: 300,
  },

  authCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: COLORS.navy,
  },

  mutedText: {
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 19,
    marginTop: 5,
  },

  fieldContainer: {
    marginTop: 17,
  },

  fieldLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FAFBFD",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 13,
    color: COLORS.text,
    fontSize: 14,
  },

  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.blue,
  },

  secondaryButtonText: {
    color: COLORS.blue,
  },

  switchAuth: {
    alignItems: "center",
    paddingVertical: 18,
  },

  switchAuthText: {
    color: COLORS.blue,
    fontSize: 12,
    fontWeight: "700",
  },

  footerNote: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 16,
  },

  welcomeBlock: {
    marginBottom: 20,
  },

  welcomeSmall: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.blue,
  },

  welcomeTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.navy,
    marginTop: 7,
  },

  balanceCard: {
    backgroundColor: COLORS.navy,
    borderRadius: 18,
    padding: 22,
    overflow: "hidden",
  },

  balanceLabel: {
    color: "#C6D3E5",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  balanceAmount: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: "900",
    marginTop: 13,
  },

  balanceCaption: {
    color: "#B9C7D9",
    fontSize: 11,
    marginTop: 7,
  },

  balanceActions: {
    flexDirection: "row",
    marginTop: 22,
  },

  balanceAction: {
    backgroundColor: COLORS.gold,
    borderRadius: 9,
    paddingHorizontal: 17,
    paddingVertical: 12,
    marginRight: 10,
  },

  balanceActionText: {
    color: COLORS.navy,
    fontWeight: "800",
    fontSize: 12,
  },

  sectionTitle: {
    color: COLORS.navy,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 26,
    marginBottom: 13,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  quickCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 12,
    minHeight: 130,
  },

  quickIcon: {
    fontSize: 26,
    color: COLORS.blue,
    fontWeight: "900",
    marginBottom: 12,
  },

  quickTitle: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: "800",
  },

  quickSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 6,
    lineHeight: 15,
  },

  noticeCard: {
    backgroundColor: "#FFF8E8",
    borderColor: "#F0DCA9",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginTop: 18,
  },

  noticeTitle: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },

  noticeText: {
    color: "#6B5B38",
    fontSize: 11,
    lineHeight: 18,
  },

  pageTitle: {
    fontSize: 26,
    color: COLORS.navy,
    fontWeight: "900",
    marginBottom: 5,
  },

  planCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 15,
    overflow: "hidden",
  },

  planAccent: {
    width: 7,
  },

  planContent: {
    flex: 1,
    padding: 16,
  },

  planName: {
    fontSize: 16,
    color: COLORS.navy,
    fontWeight: "900",
    letterSpacing: 1,
  },

  planRange: {
    fontSize: 22,
    color: COLORS.blue,
    fontWeight: "900",
    marginTop: 9,
  },

  planDescription: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 5,
  },

  walletCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 14,
  },

  walletTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  walletCoin: {
    minWidth: 47,
    height: 43,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: "#E8EFF9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  walletCoinText: {
    color: COLORS.blue,
    fontWeight: "900",
    fontSize: 11,
  },

  walletInfo: {
    flex: 1,
  },

  walletName: {
    fontSize: 16,
    color: COLORS.navy,
    fontWeight: "900",
  },

  walletNetwork: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },

  addressLabel: {
    fontSize: 9,
    color: COLORS.muted,
    letterSpacing: 1,
    fontWeight: "800",
    marginBottom: 7,
  },

  walletAddress: {
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 18,
    backgroundColor: "#F5F7FA",
    padding: 10,
    borderRadius: 8,
    overflow: "hidden",
  },

  formCard: {
    backgroundColor: COLORS.white,
    padding: 17,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 18,
  },

  walletOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginTop: 9,
  },

  walletOptionActive: {
    borderColor: COLORS.blue,
    backgroundColor: "#EEF4FC",
  },

  walletOptionName: {
    fontSize: 13,
    color: COLORS.navy,
    fontWeight: "800",
  },

  walletOptionNetwork: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },

  radio: {
    color: COLORS.blue,
    fontSize: 18,
    fontWeight: "900",
  },

  addressBox: {
    marginTop: 17,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F5F7FA",
  },

  selectedPlanBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginTop: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedPlanLabel: {
    fontSize: 9,
    color: COLORS.muted,
    letterSpacing: 1,
    fontWeight: "800",
  },

  selectedPlanName: {
    fontSize: 17,
    color: COLORS.navy,
    fontWeight: "900",
    marginTop: 6,
  },

  emptyState: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 28,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyIcon: {
    fontSize: 42,
    color: COLORS.blue,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 17,
    color: COLORS.navy,
    fontWeight: "900",
  },

  transactionCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 12,
  },

  transactionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  transactionType: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: "800",
  },

  transactionAmount: {
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: "900",
  },

  transactionDate: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 8,
  },

  transactionStatus: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 7,
  },

  bottomBar: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: "center",
  },

  bottomBrand: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },

  bottomText: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 3,
    textAlign: "center",
  },
});