#include <openssl/conf.h>
#include <openssl/evp.h>
#include <openssl/err.h>
#include <openssl/pem.h>
#include <openssl/crypto.h>
#include <openssl/sha.h>
#include <openssl/rsa.h>

#include <bits/stdc++.h>

// bits denote the modulus size
const int bits = 2048;
// string needed for conversion to base58
static const char* pszBase58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
// Our RSA object to store key
RSA *rsa = NULL;
BIGNUM *bne = NULL;
// Key variables, that would store data in raw format
EVP_PKEY *privateKey, *publicKey;
// public key in DER format
uint8_t* pubKeyDER;
// length of DER public key
int key_len;

void set_up() {
	// standard procedure taken from assignment1 crypto.cpp
	bne = BN_new();
    int ret = BN_set_word(bne, RSA_F4);
    assert(ret==1);

    // generate a new object from the constructor functions
    rsa = RSA_new();
    privateKey = EVP_PKEY_new();
    publicKey = EVP_PKEY_new();
}

void gen_keys() {
	// generates a key pair and stores it in the RSA structure provided in rsa.
	int ret=RSA_generate_key_ex(rsa,bits,bne,NULL);
    assert(ret==1);
    
    // encode and decode a public key.
    key_len = i2d_RSA_PUBKEY(rsa, &pubKeyDER);
    // store rsa value generated in keys.
    EVP_PKEY_assign_RSA(privateKey, rsa);
    EVP_PKEY_assign_RSA(publicKey, rsa);
}

void print_keys() {
	// print keys to standard buffer.
	PEM_write_PrivateKey(stdout, privateKey, NULL, NULL, 0, NULL, NULL);
	PEM_write_PUBKEY(stdout, publicKey);
}

void free_structures() {
	BN_free(bne); // free the big number structure
	free(pubKeyDER); // free DER formatted key
	RSA_free(rsa);
}

/*
CITE:
	Following implementation is taken from: bitcoin github repo
	link: https://github.com/bitcoin/bitcoin/blob/master/src/base58.cpp
*/
std::string EncodeBase58(const unsigned char* pbegin, const unsigned char* pend)
{
    // Skip & count leading zeroes.
    int zeroes = 0;
    int length = 0;
    while (pbegin != pend && *pbegin == 0) {
        pbegin++;
        zeroes++;
    }
    // Allocate enough space in big-endian base58 representation.
    int size = (pend - pbegin) * 138 / 100 + 1; // log(256) / log(58), rounded up.
    std::vector<unsigned char> b58(size);
    // Process the bytes.
    while (pbegin != pend) {
        int carry = *pbegin;
        int i = 0;
        // Apply "b58 = b58 * 256 + ch".
        for (std::vector<unsigned char>::reverse_iterator it = b58.rbegin();
        	  (carry != 0 || i < length) && (it != b58.rend()); it++, i++) {
            carry += 256 * (*it);
            *it = carry % 58;
            carry /= 58;
        }

        assert(carry == 0);
        length = i;
        pbegin++;
    }
    // Skip leading zeroes in base58 result.
    std::vector<unsigned char>::iterator it = b58.begin() + (size - length);
    while (it != b58.end() && *it == 0)
        it++;
    // Translate the result into a string.
    std::string str;
    str.reserve(zeroes + (b58.end() - it));
    str.assign(zeroes, '1');
    while (it != b58.end())
        str += pszBase58[*(it++)];
    return str;
}
// cite end..

int main() {
	set_up();
	gen_keys();
	print_keys();

	// compute hash of PEM formatted public key.
	// This procedure is taken from Lec 3 slides.
	unsigned char h1[SHA256_DIGEST_LENGTH];
	SHA256_CTX sha256;
	SHA256_Init(&sha256);
	SHA256_Update(&sha256, &pubKeyDER[0], key_len);
	SHA256_Final(h1, &sha256);

	// Encode it in base58 using the standard implementation.
	auto bitcoin_addr = EncodeBase58(h1, h1+SHA256_DIGEST_LENGTH);
	// print the bitcoint address generated.
	std::cout << bitcoin_addr << "\n";

	free_structures();
}