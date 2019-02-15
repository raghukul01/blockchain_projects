#include <openssl/conf.h>
#include <openssl/evp.h>
#include <openssl/err.h>
#include <openssl/pem.h>
#include <openssl/crypto.h>
#include <openssl/sha.h>
#include <cstdio>
#include <cstring>
#include <string>
#include <assert.h>

#include <iostream>
#include <cstdlib>

#include "crypto.h"

int main() {
	crypto_init();
	keypair_t keys = generate_rsa_keys();

	
}