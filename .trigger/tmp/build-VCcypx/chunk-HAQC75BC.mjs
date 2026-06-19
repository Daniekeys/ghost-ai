import {
  __commonJS,
  __export,
  __name,
  __toESM,
  init_esm
} from "./chunk-4DNCWKMJ.mjs";

// node_modules/@stablelib/base64/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/@stablelib/base64/lib/base64.js"(exports) {
    "use strict";
    init_esm();
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = /* @__PURE__ */ __name(function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      }, "extendStatics");
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        __name(__, "__");
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    var INVALID_BYTE = 256;
    var Coder = (
      /** @class */
      function() {
        function Coder2(_paddingCharacter) {
          if (_paddingCharacter === void 0) {
            _paddingCharacter = "=";
          }
          this._paddingCharacter = _paddingCharacter;
        }
        __name(Coder2, "Coder");
        Coder2.prototype.encodedLength = function(length) {
          if (!this._paddingCharacter) {
            return (length * 8 + 5) / 6 | 0;
          }
          return (length + 2) / 3 * 4 | 0;
        };
        Coder2.prototype.encode = function(data) {
          var out = "";
          var i = 0;
          for (; i < data.length - 2; i += 3) {
            var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            out += this._encodeByte(c >>> 1 * 6 & 63);
            out += this._encodeByte(c >>> 0 * 6 & 63);
          }
          var left = data.length - i;
          if (left > 0) {
            var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            if (left === 2) {
              out += this._encodeByte(c >>> 1 * 6 & 63);
            } else {
              out += this._paddingCharacter || "";
            }
            out += this._paddingCharacter || "";
          }
          return out;
        };
        Coder2.prototype.maxDecodedLength = function(length) {
          if (!this._paddingCharacter) {
            return (length * 6 + 7) / 8 | 0;
          }
          return length / 4 * 3 | 0;
        };
        Coder2.prototype.decodedLength = function(s) {
          return this.maxDecodedLength(s.length - this._getPaddingLength(s));
        };
        Coder2.prototype.decode = function(s) {
          if (s.length === 0) {
            return new Uint8Array(0);
          }
          var paddingLength = this._getPaddingLength(s);
          var length = s.length - paddingLength;
          var out = new Uint8Array(this.maxDecodedLength(length));
          var op = 0;
          var i = 0;
          var haveBad = 0;
          var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
          for (; i < length - 4; i += 4) {
            v0 = this._decodeChar(s.charCodeAt(i + 0));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v0 << 2 | v1 >>> 4;
            out[op++] = v1 << 4 | v2 >>> 2;
            out[op++] = v2 << 6 | v3;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
            haveBad |= v2 & INVALID_BYTE;
            haveBad |= v3 & INVALID_BYTE;
          }
          if (i < length - 1) {
            v0 = this._decodeChar(s.charCodeAt(i));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            out[op++] = v0 << 2 | v1 >>> 4;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
          }
          if (i < length - 2) {
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            out[op++] = v1 << 4 | v2 >>> 2;
            haveBad |= v2 & INVALID_BYTE;
          }
          if (i < length - 3) {
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v2 << 6 | v3;
            haveBad |= v3 & INVALID_BYTE;
          }
          if (haveBad !== 0) {
            throw new Error("Base64Coder: incorrect characters for decoding");
          }
          return out;
        };
        Coder2.prototype._encodeByte = function(b) {
          var result = b;
          result += 65;
          result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
          result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
          result += 61 - b >>> 8 & 52 - 48 - 62 + 43;
          result += 62 - b >>> 8 & 62 - 43 - 63 + 47;
          return String.fromCharCode(result);
        };
        Coder2.prototype._decodeChar = function(c) {
          var result = INVALID_BYTE;
          result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
          result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
          result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
          result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
          result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
          return result;
        };
        Coder2.prototype._getPaddingLength = function(s) {
          var paddingLength = 0;
          if (this._paddingCharacter) {
            for (var i = s.length - 1; i >= 0; i--) {
              if (s[i] !== this._paddingCharacter) {
                break;
              }
              paddingLength++;
            }
            if (s.length < 4 || paddingLength > 2) {
              throw new Error("Base64Coder: incorrect padding");
            }
          }
          return paddingLength;
        };
        return Coder2;
      }()
    );
    exports.Coder = Coder;
    var stdCoder = new Coder();
    function encode4(data) {
      return stdCoder.encode(data);
    }
    __name(encode4, "encode");
    exports.encode = encode4;
    function decode3(s) {
      return stdCoder.decode(s);
    }
    __name(decode3, "decode");
    exports.decode = decode3;
    var URLSafeCoder = (
      /** @class */
      function(_super) {
        __extends(URLSafeCoder2, _super);
        function URLSafeCoder2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        __name(URLSafeCoder2, "URLSafeCoder");
        URLSafeCoder2.prototype._encodeByte = function(b) {
          var result = b;
          result += 65;
          result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
          result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
          result += 61 - b >>> 8 & 52 - 48 - 62 + 45;
          result += 62 - b >>> 8 & 62 - 45 - 63 + 95;
          return String.fromCharCode(result);
        };
        URLSafeCoder2.prototype._decodeChar = function(c) {
          var result = INVALID_BYTE;
          result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
          result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
          result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
          result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
          result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
          return result;
        };
        return URLSafeCoder2;
      }(Coder)
    );
    exports.URLSafeCoder = URLSafeCoder;
    var urlSafeCoder = new URLSafeCoder();
    function encodeURLSafe(data) {
      return urlSafeCoder.encode(data);
    }
    __name(encodeURLSafe, "encodeURLSafe");
    exports.encodeURLSafe = encodeURLSafe;
    function decodeURLSafe(s) {
      return urlSafeCoder.decode(s);
    }
    __name(decodeURLSafe, "decodeURLSafe");
    exports.decodeURLSafe = decodeURLSafe;
    exports.encodedLength = function(length) {
      return stdCoder.encodedLength(length);
    };
    exports.maxDecodedLength = function(length) {
      return stdCoder.maxDecodedLength(length);
    };
    exports.decodedLength = function(s) {
      return stdCoder.decodedLength(s);
    };
  }
});

// node_modules/fast-sha256/sha256.js
var require_sha256 = __commonJS({
  "node_modules/fast-sha256/sha256.js"(exports, module) {
    init_esm();
    (function(root, factory) {
      var exports2 = {};
      factory(exports2);
      var sha2562 = exports2["default"];
      for (var k in exports2) {
        sha2562[k] = exports2[k];
      }
      if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = sha2562;
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          return sha2562;
        });
      } else {
        root.sha256 = sha2562;
      }
    })(exports, function(exports2) {
      "use strict";
      exports2.__esModule = true;
      exports2.digestLength = 32;
      exports2.blockSize = 64;
      var K = new Uint32Array([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      function hashBlocks(w, v, p, pos, len) {
        var a, b, c, d, e, f, g2, h, u, i, j, t1, t2;
        while (len >= 64) {
          a = v[0];
          b = v[1];
          c = v[2];
          d = v[3];
          e = v[4];
          f = v[5];
          g2 = v[6];
          h = v[7];
          for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] = (p[j] & 255) << 24 | (p[j + 1] & 255) << 16 | (p[j + 2] & 255) << 8 | p[j + 3] & 255;
          }
          for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
            u = w[i - 15];
            t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
            w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
          }
          for (i = 0; i < 64; i++) {
            t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g2) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
            t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
            h = g2;
            g2 = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
          }
          v[0] += a;
          v[1] += b;
          v[2] += c;
          v[3] += d;
          v[4] += e;
          v[5] += f;
          v[6] += g2;
          v[7] += h;
          pos += 64;
          len -= 64;
        }
        return pos;
      }
      __name(hashBlocks, "hashBlocks");
      var Hash = (
        /** @class */
        function() {
          function Hash2() {
            this.digestLength = exports2.digestLength;
            this.blockSize = exports2.blockSize;
            this.state = new Int32Array(8);
            this.temp = new Int32Array(64);
            this.buffer = new Uint8Array(128);
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            this.reset();
          }
          __name(Hash2, "Hash");
          Hash2.prototype.reset = function() {
            this.state[0] = 1779033703;
            this.state[1] = 3144134277;
            this.state[2] = 1013904242;
            this.state[3] = 2773480762;
            this.state[4] = 1359893119;
            this.state[5] = 2600822924;
            this.state[6] = 528734635;
            this.state[7] = 1541459225;
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            return this;
          };
          Hash2.prototype.clean = function() {
            for (var i = 0; i < this.buffer.length; i++) {
              this.buffer[i] = 0;
            }
            for (var i = 0; i < this.temp.length; i++) {
              this.temp[i] = 0;
            }
            this.reset();
          };
          Hash2.prototype.update = function(data, dataLength) {
            if (dataLength === void 0) {
              dataLength = data.length;
            }
            if (this.finished) {
              throw new Error("SHA256: can't update because hash was finished.");
            }
            var dataPos = 0;
            this.bytesHashed += dataLength;
            if (this.bufferLength > 0) {
              while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
              }
              if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
              }
            }
            if (dataLength >= 64) {
              dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
              dataLength %= 64;
            }
            while (dataLength > 0) {
              this.buffer[this.bufferLength++] = data[dataPos++];
              dataLength--;
            }
            return this;
          };
          Hash2.prototype.finish = function(out) {
            if (!this.finished) {
              var bytesHashed = this.bytesHashed;
              var left = this.bufferLength;
              var bitLenHi = bytesHashed / 536870912 | 0;
              var bitLenLo = bytesHashed << 3;
              var padLength = bytesHashed % 64 < 56 ? 64 : 128;
              this.buffer[left] = 128;
              for (var i = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
              }
              this.buffer[padLength - 8] = bitLenHi >>> 24 & 255;
              this.buffer[padLength - 7] = bitLenHi >>> 16 & 255;
              this.buffer[padLength - 6] = bitLenHi >>> 8 & 255;
              this.buffer[padLength - 5] = bitLenHi >>> 0 & 255;
              this.buffer[padLength - 4] = bitLenLo >>> 24 & 255;
              this.buffer[padLength - 3] = bitLenLo >>> 16 & 255;
              this.buffer[padLength - 2] = bitLenLo >>> 8 & 255;
              this.buffer[padLength - 1] = bitLenLo >>> 0 & 255;
              hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
              this.finished = true;
            }
            for (var i = 0; i < 8; i++) {
              out[i * 4 + 0] = this.state[i] >>> 24 & 255;
              out[i * 4 + 1] = this.state[i] >>> 16 & 255;
              out[i * 4 + 2] = this.state[i] >>> 8 & 255;
              out[i * 4 + 3] = this.state[i] >>> 0 & 255;
            }
            return this;
          };
          Hash2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          Hash2.prototype._saveState = function(out) {
            for (var i = 0; i < this.state.length; i++) {
              out[i] = this.state[i];
            }
          };
          Hash2.prototype._restoreState = function(from, bytesHashed) {
            for (var i = 0; i < this.state.length; i++) {
              this.state[i] = from[i];
            }
            this.bytesHashed = bytesHashed;
            this.finished = false;
            this.bufferLength = 0;
          };
          return Hash2;
        }()
      );
      exports2.Hash = Hash;
      var HMAC = (
        /** @class */
        function() {
          function HMAC2(key) {
            this.inner = new Hash();
            this.outer = new Hash();
            this.blockSize = this.inner.blockSize;
            this.digestLength = this.inner.digestLength;
            var pad = new Uint8Array(this.blockSize);
            if (key.length > this.blockSize) {
              new Hash().update(key).finish(pad).clean();
            } else {
              for (var i = 0; i < key.length; i++) {
                pad[i] = key[i];
              }
            }
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54;
            }
            this.inner.update(pad);
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54 ^ 92;
            }
            this.outer.update(pad);
            this.istate = new Uint32Array(8);
            this.ostate = new Uint32Array(8);
            this.inner._saveState(this.istate);
            this.outer._saveState(this.ostate);
            for (var i = 0; i < pad.length; i++) {
              pad[i] = 0;
            }
          }
          __name(HMAC2, "HMAC");
          HMAC2.prototype.reset = function() {
            this.inner._restoreState(this.istate, this.inner.blockSize);
            this.outer._restoreState(this.ostate, this.outer.blockSize);
            return this;
          };
          HMAC2.prototype.clean = function() {
            for (var i = 0; i < this.istate.length; i++) {
              this.ostate[i] = this.istate[i] = 0;
            }
            this.inner.clean();
            this.outer.clean();
          };
          HMAC2.prototype.update = function(data) {
            this.inner.update(data);
            return this;
          };
          HMAC2.prototype.finish = function(out) {
            if (this.outer.finished) {
              this.outer.finish(out);
            } else {
              this.inner.finish(out);
              this.outer.update(out, this.digestLength).finish(out);
            }
            return this;
          };
          HMAC2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          return HMAC2;
        }()
      );
      exports2.HMAC = HMAC;
      function hash2(data) {
        var h = new Hash().update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      __name(hash2, "hash");
      exports2.hash = hash2;
      exports2["default"] = hash2;
      function hmac2(key, data) {
        var h = new HMAC(key).update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      __name(hmac2, "hmac");
      exports2.hmac = hmac2;
      function fillBuffer(buffer, hmac3, info, counter) {
        var num = counter[0];
        if (num === 0) {
          throw new Error("hkdf: cannot expand more");
        }
        hmac3.reset();
        if (num > 1) {
          hmac3.update(buffer);
        }
        if (info) {
          hmac3.update(info);
        }
        hmac3.update(counter);
        hmac3.finish(buffer);
        counter[0]++;
      }
      __name(fillBuffer, "fillBuffer");
      var hkdfSalt = new Uint8Array(exports2.digestLength);
      function hkdf(key, salt, info, length) {
        if (salt === void 0) {
          salt = hkdfSalt;
        }
        if (length === void 0) {
          length = 32;
        }
        var counter = new Uint8Array([1]);
        var okm = hmac2(salt, key);
        var hmac_ = new HMAC(okm);
        var buffer = new Uint8Array(hmac_.digestLength);
        var bufpos = buffer.length;
        var out = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
          if (bufpos === buffer.length) {
            fillBuffer(buffer, hmac_, info, counter);
            bufpos = 0;
          }
          out[i] = buffer[bufpos++];
        }
        hmac_.clean();
        buffer.fill(0);
        counter.fill(0);
        return out;
      }
      __name(hkdf, "hkdf");
      exports2.hkdf = hkdf;
      function pbkdf2(password, salt, iterations, dkLen) {
        var prf = new HMAC(password);
        var len = prf.digestLength;
        var ctr = new Uint8Array(4);
        var t = new Uint8Array(len);
        var u = new Uint8Array(len);
        var dk = new Uint8Array(dkLen);
        for (var i = 0; i * len < dkLen; i++) {
          var c = i + 1;
          ctr[0] = c >>> 24 & 255;
          ctr[1] = c >>> 16 & 255;
          ctr[2] = c >>> 8 & 255;
          ctr[3] = c >>> 0 & 255;
          prf.reset();
          prf.update(salt);
          prf.update(ctr);
          prf.finish(u);
          for (var j = 0; j < len; j++) {
            t[j] = u[j];
          }
          for (var j = 2; j <= iterations; j++) {
            prf.reset();
            prf.update(u).finish(u);
            for (var k = 0; k < len; k++) {
              t[k] ^= u[k];
            }
          }
          for (var j = 0; j < len && i * len + j < dkLen; j++) {
            dk[i * len + j] = t[j];
          }
        }
        for (var i = 0; i < len; i++) {
          t[i] = u[i] = 0;
        }
        for (var i = 0; i < 4; i++) {
          ctr[i] = 0;
        }
        prf.clean();
        return dk;
      }
      __name(pbkdf2, "pbkdf2");
      exports2.pbkdf2 = pbkdf2;
    });
  }
});

// node_modules/zod/v4/classic/external.js
var external_exports = {};
__export(external_exports, {
  $brand: () => $brand,
  $input: () => $input,
  $output: () => $output,
  NEVER: () => NEVER,
  TimePrecision: () => TimePrecision,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBase64: () => ZodBase64,
  ZodBase64URL: () => ZodBase64URL,
  ZodBigInt: () => ZodBigInt,
  ZodBigIntFormat: () => ZodBigIntFormat,
  ZodBoolean: () => ZodBoolean,
  ZodCIDRv4: () => ZodCIDRv4,
  ZodCIDRv6: () => ZodCIDRv6,
  ZodCUID: () => ZodCUID,
  ZodCUID2: () => ZodCUID2,
  ZodCatch: () => ZodCatch,
  ZodCodec: () => ZodCodec,
  ZodCustom: () => ZodCustom,
  ZodCustomStringFormat: () => ZodCustomStringFormat,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodE164: () => ZodE164,
  ZodEmail: () => ZodEmail,
  ZodEmoji: () => ZodEmoji,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodExactOptional: () => ZodExactOptional,
  ZodFile: () => ZodFile,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodGUID: () => ZodGUID,
  ZodIPv4: () => ZodIPv4,
  ZodIPv6: () => ZodIPv6,
  ZodISODate: () => ZodISODate,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODuration: () => ZodISODuration,
  ZodISOTime: () => ZodISOTime,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodJWT: () => ZodJWT,
  ZodKSUID: () => ZodKSUID,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMAC: () => ZodMAC,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNanoID: () => ZodNanoID,
  ZodNever: () => ZodNever,
  ZodNonOptional: () => ZodNonOptional,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodNumberFormat: () => ZodNumberFormat,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodPipe: () => ZodPipe,
  ZodPrefault: () => ZodPrefault,
  ZodPreprocess: () => ZodPreprocess,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRealError: () => ZodRealError,
  ZodRecord: () => ZodRecord,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodStringFormat: () => ZodStringFormat,
  ZodSuccess: () => ZodSuccess,
  ZodSymbol: () => ZodSymbol,
  ZodTemplateLiteral: () => ZodTemplateLiteral,
  ZodTransform: () => ZodTransform,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodULID: () => ZodULID,
  ZodURL: () => ZodURL,
  ZodUUID: () => ZodUUID,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  ZodXID: () => ZodXID,
  ZodXor: () => ZodXor,
  _ZodString: () => _ZodString,
  _default: () => _default2,
  _function: () => _function,
  any: () => any,
  array: () => array,
  base64: () => base642,
  base64url: () => base64url2,
  bigint: () => bigint2,
  boolean: () => boolean2,
  catch: () => _catch2,
  check: () => check,
  cidrv4: () => cidrv42,
  cidrv6: () => cidrv62,
  clone: () => clone,
  codec: () => codec,
  coerce: () => coerce_exports,
  config: () => config,
  core: () => core_exports2,
  cuid: () => cuid3,
  cuid2: () => cuid22,
  custom: () => custom,
  date: () => date3,
  decode: () => decode2,
  decodeAsync: () => decodeAsync2,
  describe: () => describe2,
  discriminatedUnion: () => discriminatedUnion,
  e164: () => e1642,
  email: () => email2,
  emoji: () => emoji2,
  encode: () => encode2,
  encodeAsync: () => encodeAsync2,
  endsWith: () => _endsWith,
  enum: () => _enum2,
  exactOptional: () => exactOptional,
  file: () => file,
  flattenError: () => flattenError,
  float32: () => float32,
  float64: () => float64,
  formatError: () => formatError,
  fromJSONSchema: () => fromJSONSchema,
  function: () => _function,
  getErrorMap: () => getErrorMap,
  globalRegistry: () => globalRegistry,
  gt: () => _gt,
  gte: () => _gte,
  guid: () => guid2,
  hash: () => hash,
  hex: () => hex2,
  hostname: () => hostname2,
  httpUrl: () => httpUrl,
  includes: () => _includes,
  instanceof: () => _instanceof,
  int: () => int,
  int32: () => int32,
  int64: () => int64,
  intersection: () => intersection,
  invertCodec: () => invertCodec,
  ipv4: () => ipv42,
  ipv6: () => ipv62,
  iso: () => iso_exports,
  json: () => json,
  jwt: () => jwt,
  keyof: () => keyof,
  ksuid: () => ksuid2,
  lazy: () => lazy,
  length: () => _length,
  literal: () => literal,
  locales: () => locales_exports,
  looseObject: () => looseObject,
  looseRecord: () => looseRecord,
  lowercase: () => _lowercase,
  lt: () => _lt,
  lte: () => _lte,
  mac: () => mac2,
  map: () => map,
  maxLength: () => _maxLength,
  maxSize: () => _maxSize,
  meta: () => meta2,
  mime: () => _mime,
  minLength: () => _minLength,
  minSize: () => _minSize,
  multipleOf: () => _multipleOf,
  nan: () => nan,
  nanoid: () => nanoid2,
  nativeEnum: () => nativeEnum,
  negative: () => _negative,
  never: () => never,
  nonnegative: () => _nonnegative,
  nonoptional: () => nonoptional,
  nonpositive: () => _nonpositive,
  normalize: () => _normalize,
  null: () => _null3,
  nullable: () => nullable,
  nullish: () => nullish2,
  number: () => number2,
  object: () => object,
  optional: () => optional,
  overwrite: () => _overwrite,
  parse: () => parse2,
  parseAsync: () => parseAsync2,
  partialRecord: () => partialRecord,
  pipe: () => pipe,
  positive: () => _positive,
  prefault: () => prefault,
  preprocess: () => preprocess,
  prettifyError: () => prettifyError,
  promise: () => promise,
  property: () => _property,
  readonly: () => readonly,
  record: () => record,
  refine: () => refine,
  regex: () => _regex,
  regexes: () => regexes_exports,
  registry: () => registry,
  safeDecode: () => safeDecode2,
  safeDecodeAsync: () => safeDecodeAsync2,
  safeEncode: () => safeEncode2,
  safeEncodeAsync: () => safeEncodeAsync2,
  safeParse: () => safeParse2,
  safeParseAsync: () => safeParseAsync2,
  set: () => set,
  setErrorMap: () => setErrorMap,
  size: () => _size,
  slugify: () => _slugify,
  startsWith: () => _startsWith,
  strictObject: () => strictObject,
  string: () => string2,
  stringFormat: () => stringFormat,
  stringbool: () => stringbool,
  success: () => success,
  superRefine: () => superRefine,
  symbol: () => symbol,
  templateLiteral: () => templateLiteral,
  toJSONSchema: () => toJSONSchema,
  toLowerCase: () => _toLowerCase,
  toUpperCase: () => _toUpperCase,
  transform: () => transform,
  treeifyError: () => treeifyError,
  trim: () => _trim,
  tuple: () => tuple,
  uint32: () => uint32,
  uint64: () => uint64,
  ulid: () => ulid2,
  undefined: () => _undefined3,
  union: () => union,
  unknown: () => unknown,
  uppercase: () => _uppercase,
  url: () => url,
  util: () => util_exports,
  uuid: () => uuid2,
  uuidv4: () => uuidv4,
  uuidv6: () => uuidv6,
  uuidv7: () => uuidv7,
  void: () => _void2,
  xid: () => xid2,
  xor: () => xor
});
init_esm();

// node_modules/zod/v4/core/index.js
var core_exports2 = {};
__export(core_exports2, {
  $ZodAny: () => $ZodAny,
  $ZodArray: () => $ZodArray,
  $ZodAsyncError: () => $ZodAsyncError,
  $ZodBase64: () => $ZodBase64,
  $ZodBase64URL: () => $ZodBase64URL,
  $ZodBigInt: () => $ZodBigInt,
  $ZodBigIntFormat: () => $ZodBigIntFormat,
  $ZodBoolean: () => $ZodBoolean,
  $ZodCIDRv4: () => $ZodCIDRv4,
  $ZodCIDRv6: () => $ZodCIDRv6,
  $ZodCUID: () => $ZodCUID,
  $ZodCUID2: () => $ZodCUID2,
  $ZodCatch: () => $ZodCatch,
  $ZodCheck: () => $ZodCheck,
  $ZodCheckBigIntFormat: () => $ZodCheckBigIntFormat,
  $ZodCheckEndsWith: () => $ZodCheckEndsWith,
  $ZodCheckGreaterThan: () => $ZodCheckGreaterThan,
  $ZodCheckIncludes: () => $ZodCheckIncludes,
  $ZodCheckLengthEquals: () => $ZodCheckLengthEquals,
  $ZodCheckLessThan: () => $ZodCheckLessThan,
  $ZodCheckLowerCase: () => $ZodCheckLowerCase,
  $ZodCheckMaxLength: () => $ZodCheckMaxLength,
  $ZodCheckMaxSize: () => $ZodCheckMaxSize,
  $ZodCheckMimeType: () => $ZodCheckMimeType,
  $ZodCheckMinLength: () => $ZodCheckMinLength,
  $ZodCheckMinSize: () => $ZodCheckMinSize,
  $ZodCheckMultipleOf: () => $ZodCheckMultipleOf,
  $ZodCheckNumberFormat: () => $ZodCheckNumberFormat,
  $ZodCheckOverwrite: () => $ZodCheckOverwrite,
  $ZodCheckProperty: () => $ZodCheckProperty,
  $ZodCheckRegex: () => $ZodCheckRegex,
  $ZodCheckSizeEquals: () => $ZodCheckSizeEquals,
  $ZodCheckStartsWith: () => $ZodCheckStartsWith,
  $ZodCheckStringFormat: () => $ZodCheckStringFormat,
  $ZodCheckUpperCase: () => $ZodCheckUpperCase,
  $ZodCodec: () => $ZodCodec,
  $ZodCustom: () => $ZodCustom,
  $ZodCustomStringFormat: () => $ZodCustomStringFormat,
  $ZodDate: () => $ZodDate,
  $ZodDefault: () => $ZodDefault,
  $ZodDiscriminatedUnion: () => $ZodDiscriminatedUnion,
  $ZodE164: () => $ZodE164,
  $ZodEmail: () => $ZodEmail,
  $ZodEmoji: () => $ZodEmoji,
  $ZodEncodeError: () => $ZodEncodeError,
  $ZodEnum: () => $ZodEnum,
  $ZodError: () => $ZodError,
  $ZodExactOptional: () => $ZodExactOptional,
  $ZodFile: () => $ZodFile,
  $ZodFunction: () => $ZodFunction,
  $ZodGUID: () => $ZodGUID,
  $ZodIPv4: () => $ZodIPv4,
  $ZodIPv6: () => $ZodIPv6,
  $ZodISODate: () => $ZodISODate,
  $ZodISODateTime: () => $ZodISODateTime,
  $ZodISODuration: () => $ZodISODuration,
  $ZodISOTime: () => $ZodISOTime,
  $ZodIntersection: () => $ZodIntersection,
  $ZodJWT: () => $ZodJWT,
  $ZodKSUID: () => $ZodKSUID,
  $ZodLazy: () => $ZodLazy,
  $ZodLiteral: () => $ZodLiteral,
  $ZodMAC: () => $ZodMAC,
  $ZodMap: () => $ZodMap,
  $ZodNaN: () => $ZodNaN,
  $ZodNanoID: () => $ZodNanoID,
  $ZodNever: () => $ZodNever,
  $ZodNonOptional: () => $ZodNonOptional,
  $ZodNull: () => $ZodNull,
  $ZodNullable: () => $ZodNullable,
  $ZodNumber: () => $ZodNumber,
  $ZodNumberFormat: () => $ZodNumberFormat,
  $ZodObject: () => $ZodObject,
  $ZodObjectJIT: () => $ZodObjectJIT,
  $ZodOptional: () => $ZodOptional,
  $ZodPipe: () => $ZodPipe,
  $ZodPrefault: () => $ZodPrefault,
  $ZodPreprocess: () => $ZodPreprocess,
  $ZodPromise: () => $ZodPromise,
  $ZodReadonly: () => $ZodReadonly,
  $ZodRealError: () => $ZodRealError,
  $ZodRecord: () => $ZodRecord,
  $ZodRegistry: () => $ZodRegistry,
  $ZodSet: () => $ZodSet,
  $ZodString: () => $ZodString,
  $ZodStringFormat: () => $ZodStringFormat,
  $ZodSuccess: () => $ZodSuccess,
  $ZodSymbol: () => $ZodSymbol,
  $ZodTemplateLiteral: () => $ZodTemplateLiteral,
  $ZodTransform: () => $ZodTransform,
  $ZodTuple: () => $ZodTuple,
  $ZodType: () => $ZodType,
  $ZodULID: () => $ZodULID,
  $ZodURL: () => $ZodURL,
  $ZodUUID: () => $ZodUUID,
  $ZodUndefined: () => $ZodUndefined,
  $ZodUnion: () => $ZodUnion,
  $ZodUnknown: () => $ZodUnknown,
  $ZodVoid: () => $ZodVoid,
  $ZodXID: () => $ZodXID,
  $ZodXor: () => $ZodXor,
  $brand: () => $brand,
  $constructor: () => $constructor,
  $input: () => $input,
  $output: () => $output,
  Doc: () => Doc,
  JSONSchema: () => json_schema_exports,
  JSONSchemaGenerator: () => JSONSchemaGenerator,
  NEVER: () => NEVER,
  TimePrecision: () => TimePrecision,
  _any: () => _any,
  _array: () => _array,
  _base64: () => _base64,
  _base64url: () => _base64url,
  _bigint: () => _bigint,
  _boolean: () => _boolean,
  _catch: () => _catch,
  _check: () => _check,
  _cidrv4: () => _cidrv4,
  _cidrv6: () => _cidrv6,
  _coercedBigint: () => _coercedBigint,
  _coercedBoolean: () => _coercedBoolean,
  _coercedDate: () => _coercedDate,
  _coercedNumber: () => _coercedNumber,
  _coercedString: () => _coercedString,
  _cuid: () => _cuid,
  _cuid2: () => _cuid2,
  _custom: () => _custom,
  _date: () => _date,
  _decode: () => _decode,
  _decodeAsync: () => _decodeAsync,
  _default: () => _default,
  _discriminatedUnion: () => _discriminatedUnion,
  _e164: () => _e164,
  _email: () => _email,
  _emoji: () => _emoji2,
  _encode: () => _encode,
  _encodeAsync: () => _encodeAsync,
  _endsWith: () => _endsWith,
  _enum: () => _enum,
  _file: () => _file,
  _float32: () => _float32,
  _float64: () => _float64,
  _gt: () => _gt,
  _gte: () => _gte,
  _guid: () => _guid,
  _includes: () => _includes,
  _int: () => _int,
  _int32: () => _int32,
  _int64: () => _int64,
  _intersection: () => _intersection,
  _ipv4: () => _ipv4,
  _ipv6: () => _ipv6,
  _isoDate: () => _isoDate,
  _isoDateTime: () => _isoDateTime,
  _isoDuration: () => _isoDuration,
  _isoTime: () => _isoTime,
  _jwt: () => _jwt,
  _ksuid: () => _ksuid,
  _lazy: () => _lazy,
  _length: () => _length,
  _literal: () => _literal,
  _lowercase: () => _lowercase,
  _lt: () => _lt,
  _lte: () => _lte,
  _mac: () => _mac,
  _map: () => _map,
  _max: () => _lte,
  _maxLength: () => _maxLength,
  _maxSize: () => _maxSize,
  _mime: () => _mime,
  _min: () => _gte,
  _minLength: () => _minLength,
  _minSize: () => _minSize,
  _multipleOf: () => _multipleOf,
  _nan: () => _nan,
  _nanoid: () => _nanoid,
  _nativeEnum: () => _nativeEnum,
  _negative: () => _negative,
  _never: () => _never,
  _nonnegative: () => _nonnegative,
  _nonoptional: () => _nonoptional,
  _nonpositive: () => _nonpositive,
  _normalize: () => _normalize,
  _null: () => _null2,
  _nullable: () => _nullable,
  _number: () => _number,
  _optional: () => _optional,
  _overwrite: () => _overwrite,
  _parse: () => _parse,
  _parseAsync: () => _parseAsync,
  _pipe: () => _pipe,
  _positive: () => _positive,
  _promise: () => _promise,
  _property: () => _property,
  _readonly: () => _readonly,
  _record: () => _record,
  _refine: () => _refine,
  _regex: () => _regex,
  _safeDecode: () => _safeDecode,
  _safeDecodeAsync: () => _safeDecodeAsync,
  _safeEncode: () => _safeEncode,
  _safeEncodeAsync: () => _safeEncodeAsync,
  _safeParse: () => _safeParse,
  _safeParseAsync: () => _safeParseAsync,
  _set: () => _set,
  _size: () => _size,
  _slugify: () => _slugify,
  _startsWith: () => _startsWith,
  _string: () => _string,
  _stringFormat: () => _stringFormat,
  _stringbool: () => _stringbool,
  _success: () => _success,
  _superRefine: () => _superRefine,
  _symbol: () => _symbol,
  _templateLiteral: () => _templateLiteral,
  _toLowerCase: () => _toLowerCase,
  _toUpperCase: () => _toUpperCase,
  _transform: () => _transform,
  _trim: () => _trim,
  _tuple: () => _tuple,
  _uint32: () => _uint32,
  _uint64: () => _uint64,
  _ulid: () => _ulid,
  _undefined: () => _undefined2,
  _union: () => _union,
  _unknown: () => _unknown,
  _uppercase: () => _uppercase,
  _url: () => _url,
  _uuid: () => _uuid,
  _uuidv4: () => _uuidv4,
  _uuidv6: () => _uuidv6,
  _uuidv7: () => _uuidv7,
  _void: () => _void,
  _xid: () => _xid,
  _xor: () => _xor,
  clone: () => clone,
  config: () => config,
  createStandardJSONSchemaMethod: () => createStandardJSONSchemaMethod,
  createToJSONSchemaMethod: () => createToJSONSchemaMethod,
  decode: () => decode,
  decodeAsync: () => decodeAsync,
  describe: () => describe,
  encode: () => encode,
  encodeAsync: () => encodeAsync,
  extractDefs: () => extractDefs,
  finalize: () => finalize,
  flattenError: () => flattenError,
  formatError: () => formatError,
  globalConfig: () => globalConfig,
  globalRegistry: () => globalRegistry,
  initializeContext: () => initializeContext,
  isValidBase64: () => isValidBase64,
  isValidBase64URL: () => isValidBase64URL,
  isValidJWT: () => isValidJWT,
  locales: () => locales_exports,
  meta: () => meta,
  parse: () => parse,
  parseAsync: () => parseAsync,
  prettifyError: () => prettifyError,
  process: () => process2,
  regexes: () => regexes_exports,
  registry: () => registry,
  safeDecode: () => safeDecode,
  safeDecodeAsync: () => safeDecodeAsync,
  safeEncode: () => safeEncode,
  safeEncodeAsync: () => safeEncodeAsync,
  safeParse: () => safeParse,
  safeParseAsync: () => safeParseAsync,
  toDotPath: () => toDotPath,
  toJSONSchema: () => toJSONSchema,
  treeifyError: () => treeifyError,
  util: () => util_exports,
  version: () => version
});
init_esm();

// node_modules/zod/v4/core/core.js
init_esm();
var _a;
var NEVER = /* @__PURE__ */ Object.freeze({
  status: "aborted"
});
// @__NO_SIDE_EFFECTS__
function $constructor(name, initializer3, params) {
  function init(inst, def2) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def: def2,
          constr: _,
          traits: /* @__PURE__ */ new Set()
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer3(inst, def2);
    const proto = _.prototype;
    const keys = Object.keys(proto);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  __name(init, "init");
  const Parent = params?.Parent ?? Object;
  class Definition extends Parent {
    static {
      __name(this, "Definition");
    }
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def2) {
    var _a3;
    const inst = params?.Parent ? new Definition() : this;
    init(inst, def2);
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  __name(_, "_");
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: /* @__PURE__ */ __name((inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }, "value")
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
__name($constructor, "$constructor");
var $brand = Symbol("zod_brand");
var $ZodAsyncError = class extends Error {
  static {
    __name(this, "$ZodAsyncError");
  }
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
};
var $ZodEncodeError = class extends Error {
  static {
    __name(this, "$ZodEncodeError");
  }
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
};
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
__name(config, "config");

// node_modules/zod/v4/core/parse.js
init_esm();

// node_modules/zod/v4/core/errors.js
init_esm();

// node_modules/zod/v4/core/util.js
var util_exports = {};
__export(util_exports, {
  BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES,
  Class: () => Class,
  NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
  aborted: () => aborted,
  allowsEval: () => allowsEval,
  assert: () => assert,
  assertEqual: () => assertEqual,
  assertIs: () => assertIs,
  assertNever: () => assertNever,
  assertNotEqual: () => assertNotEqual,
  assignProp: () => assignProp,
  base64ToUint8Array: () => base64ToUint8Array,
  base64urlToUint8Array: () => base64urlToUint8Array,
  cached: () => cached,
  captureStackTrace: () => captureStackTrace,
  cleanEnum: () => cleanEnum,
  cleanRegex: () => cleanRegex,
  clone: () => clone,
  cloneDef: () => cloneDef,
  createTransparentProxy: () => createTransparentProxy,
  defineLazy: () => defineLazy,
  esc: () => esc,
  escapeRegex: () => escapeRegex,
  explicitlyAborted: () => explicitlyAborted,
  extend: () => extend,
  finalizeIssue: () => finalizeIssue,
  floatSafeRemainder: () => floatSafeRemainder,
  getElementAtPath: () => getElementAtPath,
  getEnumValues: () => getEnumValues,
  getLengthableOrigin: () => getLengthableOrigin,
  getParsedType: () => getParsedType,
  getSizableOrigin: () => getSizableOrigin,
  hexToUint8Array: () => hexToUint8Array,
  isObject: () => isObject,
  isPlainObject: () => isPlainObject,
  issue: () => issue,
  joinValues: () => joinValues,
  jsonStringifyReplacer: () => jsonStringifyReplacer,
  merge: () => merge,
  mergeDefs: () => mergeDefs,
  normalizeParams: () => normalizeParams,
  nullish: () => nullish,
  numKeys: () => numKeys,
  objectClone: () => objectClone,
  omit: () => omit,
  optionalKeys: () => optionalKeys,
  parsedType: () => parsedType,
  partial: () => partial,
  pick: () => pick,
  prefixIssues: () => prefixIssues,
  primitiveTypes: () => primitiveTypes,
  promiseAllObject: () => promiseAllObject,
  propertyKeyTypes: () => propertyKeyTypes,
  randomString: () => randomString,
  required: () => required,
  safeExtend: () => safeExtend,
  shallowClone: () => shallowClone,
  slugify: () => slugify,
  stringifyPrimitive: () => stringifyPrimitive,
  uint8ArrayToBase64: () => uint8ArrayToBase64,
  uint8ArrayToBase64url: () => uint8ArrayToBase64url,
  uint8ArrayToHex: () => uint8ArrayToHex,
  unwrapMessage: () => unwrapMessage
});
init_esm();
function assertEqual(val) {
  return val;
}
__name(assertEqual, "assertEqual");
function assertNotEqual(val) {
  return val;
}
__name(assertNotEqual, "assertNotEqual");
function assertIs(_arg) {
}
__name(assertIs, "assertIs");
function assertNever(_x) {
  throw new Error("Unexpected value in exhaustive check");
}
__name(assertNever, "assertNever");
function assert(_) {
}
__name(assert, "assert");
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
__name(getEnumValues, "getEnumValues");
function joinValues(array2, separator = "|") {
  return array2.map((val) => stringifyPrimitive(val)).join(separator);
}
__name(joinValues, "joinValues");
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
__name(jsonStringifyReplacer, "jsonStringifyReplacer");
function cached(getter) {
  const set2 = false;
  return {
    get value() {
      if (!set2) {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
      throw new Error("cached value already set");
    }
  };
}
__name(cached, "cached");
function nullish(input) {
  return input === null || input === void 0;
}
__name(nullish, "nullish");
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
__name(cleanRegex, "cleanRegex");
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
__name(floatSafeRemainder, "floatSafeRemainder");
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object2, key, getter) {
  let value = void 0;
  Object.defineProperty(object2, key, {
    get() {
      if (value === EVALUATING) {
        return void 0;
      }
      if (value === void 0) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object2, key, {
        value: v
        // configurable: true,
      });
    },
    configurable: true
  });
}
__name(defineLazy, "defineLazy");
function objectClone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
__name(objectClone, "objectClone");
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
__name(assignProp, "assignProp");
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def2 of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def2);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
__name(mergeDefs, "mergeDefs");
function cloneDef(schema) {
  return mergeDefs(schema._zod.def);
}
__name(cloneDef, "cloneDef");
function getElementAtPath(obj, path) {
  if (!path)
    return obj;
  return path.reduce((acc, key) => acc?.[key], obj);
}
__name(getElementAtPath, "getElementAtPath");
function promiseAllObject(promisesObj) {
  const keys = Object.keys(promisesObj);
  const promises = keys.map((key) => promisesObj[key]);
  return Promise.all(promises).then((results) => {
    const resolvedObj = {};
    for (let i = 0; i < keys.length; i++) {
      resolvedObj[keys[i]] = results[i];
    }
    return resolvedObj;
  });
}
__name(promiseAllObject, "promiseAllObject");
function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
__name(randomString, "randomString");
function esc(str) {
  return JSON.stringify(str);
}
__name(esc, "esc");
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
__name(slugify, "slugify");
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
__name(isObject, "isObject");
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === void 0)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
__name(isPlainObject, "isPlainObject");
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
__name(shallowClone, "shallowClone");
function numKeys(data) {
  let keyCount = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keyCount++;
    }
  }
  return keyCount;
}
__name(numKeys, "numKeys");
var getParsedType = /* @__PURE__ */ __name((data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return "promise";
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return "map";
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return "set";
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return "date";
      }
      if (typeof File !== "undefined" && data instanceof File) {
        return "file";
      }
      return "object";
    default:
      throw new Error(`Unknown data type: ${t}`);
  }
}, "getParsedType");
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
var primitiveTypes = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
__name(escapeRegex, "escapeRegex");
function clone(inst, def2, params) {
  const cl = new inst._zod.constr(def2 ?? inst._zod.def);
  if (!def2 || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
__name(clone, "clone");
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: /* @__PURE__ */ __name(() => params, "error") };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: /* @__PURE__ */ __name(() => params.error, "error") };
  return params;
}
__name(normalizeParams, "normalizeParams");
function createTransparentProxy(getter) {
  let target;
  return new Proxy({}, {
    get(_, prop, receiver) {
      target ?? (target = getter());
      return Reflect.get(target, prop, receiver);
    },
    set(_, prop, value, receiver) {
      target ?? (target = getter());
      return Reflect.set(target, prop, value, receiver);
    },
    has(_, prop) {
      target ?? (target = getter());
      return Reflect.has(target, prop);
    },
    deleteProperty(_, prop) {
      target ?? (target = getter());
      return Reflect.deleteProperty(target, prop);
    },
    ownKeys(_) {
      target ?? (target = getter());
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(_, prop) {
      target ?? (target = getter());
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    defineProperty(_, prop, descriptor) {
      target ?? (target = getter());
      return Reflect.defineProperty(target, prop, descriptor);
    }
  });
}
__name(createTransparentProxy, "createTransparentProxy");
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
__name(stringifyPrimitive, "stringifyPrimitive");
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
  });
}
__name(optionalKeys, "optionalKeys");
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
var BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const def2 = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = {};
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def2);
}
__name(pick, "pick");
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const def2 = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = { ...schema._zod.def.shape };
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def2);
}
__name(omit, "omit");
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = schema._zod.def.shape;
    for (const key in shape) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  const def2 = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def2);
}
__name(extend, "extend");
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  const def2 = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def2);
}
__name(safeExtend, "safeExtend");
function merge(a, b) {
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const def2 = mergeDefs(a._zod.def, {
    get shape() {
      const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def2);
}
__name(merge, "merge");
function partial(Class2, schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  }
  const def2 = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = Class2 ? new Class2({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class2 ? new Class2({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone(schema, def2);
}
__name(partial, "partial");
function required(Class2, schema, mask) {
  const def2 = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = new Class2({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class2({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    }
  });
  return clone(schema, def2);
}
__name(required, "required");
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
__name(aborted, "aborted");
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
__name(explicitlyAborted, "explicitlyAborted");
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a3;
    (_a3 = iss).path ?? (_a3.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
__name(prefixIssues, "prefixIssues");
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
__name(unwrapMessage, "unwrapMessage");
function finalizeIssue(iss, ctx, config2) {
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
  const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
  rest.path ?? (rest.path = []);
  rest.message = message;
  if (ctx?.reportInput) {
    rest.input = _input;
  }
  return rest;
}
__name(finalizeIssue, "finalizeIssue");
function getSizableOrigin(input) {
  if (input instanceof Set)
    return "set";
  if (input instanceof Map)
    return "map";
  if (input instanceof File)
    return "file";
  return "unknown";
}
__name(getSizableOrigin, "getSizableOrigin");
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
__name(getLengthableOrigin, "getLengthableOrigin");
function parsedType(data) {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "nan" : "number";
    }
    case "object": {
      if (data === null) {
        return "null";
      }
      if (Array.isArray(data)) {
        return "array";
      }
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
        return obj.constructor.name;
      }
    }
  }
  return t;
}
__name(parsedType, "parsedType");
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
__name(issue, "issue");
function cleanEnum(obj) {
  return Object.entries(obj).filter(([k, _]) => {
    return Number.isNaN(Number.parseInt(k, 10));
  }).map((el) => el[1]);
}
__name(cleanEnum, "cleanEnum");
function base64ToUint8Array(base644) {
  const binaryString = atob(base644);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
__name(base64ToUint8Array, "base64ToUint8Array");
function uint8ArrayToBase64(bytes) {
  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}
__name(uint8ArrayToBase64, "uint8ArrayToBase64");
function base64urlToUint8Array(base64url3) {
  const base644 = base64url3.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - base644.length % 4) % 4);
  return base64ToUint8Array(base644 + padding);
}
__name(base64urlToUint8Array, "base64urlToUint8Array");
function uint8ArrayToBase64url(bytes) {
  return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
__name(uint8ArrayToBase64url, "uint8ArrayToBase64url");
function hexToUint8Array(hex3) {
  const cleanHex = hex3.replace(/^0x/, "");
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}
__name(hexToUint8Array, "hexToUint8Array");
function uint8ArrayToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(uint8ArrayToHex, "uint8ArrayToHex");
var Class = class {
  static {
    __name(this, "Class");
  }
  constructor(..._args) {
  }
};

// node_modules/zod/v4/core/errors.js
var initializer = /* @__PURE__ */ __name((inst, def2) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def2,
    enumerable: false
  });
  inst.message = JSON.stringify(def2, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: /* @__PURE__ */ __name(() => inst.message, "value"),
    enumerable: false
  });
}, "initializer");
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error52, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error52.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
__name(flattenError, "flattenError");
function formatError(error52, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = /* @__PURE__ */ __name((error53, path = []) => {
    for (const issue2 of error53.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else {
        const fullpath = [...path, ...issue2.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue2));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }
  }, "processError");
  processError(error52);
  return fieldErrors;
}
__name(formatError, "formatError");
function treeifyError(error52, mapper = (issue2) => issue2.message) {
  const result = { errors: [] };
  const processError = /* @__PURE__ */ __name((error53, path = []) => {
    var _a3, _b;
    for (const issue2 of error53.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else {
        const fullpath = [...path, ...issue2.path];
        if (fullpath.length === 0) {
          result.errors.push(mapper(issue2));
          continue;
        }
        let curr = result;
        let i = 0;
        while (i < fullpath.length) {
          const el = fullpath[i];
          const terminal = i === fullpath.length - 1;
          if (typeof el === "string") {
            curr.properties ?? (curr.properties = {});
            (_a3 = curr.properties)[el] ?? (_a3[el] = { errors: [] });
            curr = curr.properties[el];
          } else {
            curr.items ?? (curr.items = []);
            (_b = curr.items)[el] ?? (_b[el] = { errors: [] });
            curr = curr.items[el];
          }
          if (terminal) {
            curr.errors.push(mapper(issue2));
          }
          i++;
        }
      }
    }
  }, "processError");
  processError(error52);
  return result;
}
__name(treeifyError, "treeifyError");
function toDotPath(_path) {
  const segs = [];
  const path = _path.map((seg) => typeof seg === "object" ? seg.key : seg);
  for (const seg of path) {
    if (typeof seg === "number")
      segs.push(`[${seg}]`);
    else if (typeof seg === "symbol")
      segs.push(`[${JSON.stringify(String(seg))}]`);
    else if (/[^\w$]/.test(seg))
      segs.push(`[${JSON.stringify(seg)}]`);
    else {
      if (segs.length)
        segs.push(".");
      segs.push(seg);
    }
  }
  return segs.join("");
}
__name(toDotPath, "toDotPath");
function prettifyError(error52) {
  const lines = [];
  const issues = [...error52.issues].sort((a, b) => (a.path ?? []).length - (b.path ?? []).length);
  for (const issue2 of issues) {
    lines.push(`✖ ${issue2.message}`);
    if (issue2.path?.length)
      lines.push(`  → at ${toDotPath(issue2.path)}`);
  }
  return lines.join("\n");
}
__name(prettifyError, "prettifyError");

// node_modules/zod/v4/core/parse.js
var _parse = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
}, "_parse");
var parse = /* @__PURE__ */ _parse($ZodRealError);
var _parseAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
}, "_parseAsync");
var parseAsync = /* @__PURE__ */ _parseAsync($ZodRealError);
var _safeParse = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
}, "_safeParse");
var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
var _safeParseAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
}, "_safeParseAsync");
var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
var _encode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
}, "_encode");
var encode = /* @__PURE__ */ _encode($ZodRealError);
var _decode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
}, "_decode");
var decode = /* @__PURE__ */ _decode($ZodRealError);
var _encodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
}, "_encodeAsync");
var encodeAsync = /* @__PURE__ */ _encodeAsync($ZodRealError);
var _decodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
}, "_decodeAsync");
var decodeAsync = /* @__PURE__ */ _decodeAsync($ZodRealError);
var _safeEncode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
}, "_safeEncode");
var safeEncode = /* @__PURE__ */ _safeEncode($ZodRealError);
var _safeDecode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
}, "_safeDecode");
var safeDecode = /* @__PURE__ */ _safeDecode($ZodRealError);
var _safeEncodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
}, "_safeEncodeAsync");
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync($ZodRealError);
var _safeDecodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
}, "_safeDecodeAsync");
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync($ZodRealError);

// node_modules/zod/v4/core/schemas.js
init_esm();

// node_modules/zod/v4/core/checks.js
init_esm();

// node_modules/zod/v4/core/regexes.js
var regexes_exports = {};
__export(regexes_exports, {
  base64: () => base64,
  base64url: () => base64url,
  bigint: () => bigint,
  boolean: () => boolean,
  browserEmail: () => browserEmail,
  cidrv4: () => cidrv4,
  cidrv6: () => cidrv6,
  cuid: () => cuid,
  cuid2: () => cuid2,
  date: () => date,
  datetime: () => datetime,
  domain: () => domain,
  duration: () => duration,
  e164: () => e164,
  email: () => email,
  emoji: () => emoji,
  extendedDuration: () => extendedDuration,
  guid: () => guid,
  hex: () => hex,
  hostname: () => hostname,
  html5Email: () => html5Email,
  httpProtocol: () => httpProtocol,
  idnEmail: () => idnEmail,
  integer: () => integer,
  ipv4: () => ipv4,
  ipv6: () => ipv6,
  ksuid: () => ksuid,
  lowercase: () => lowercase,
  mac: () => mac,
  md5_base64: () => md5_base64,
  md5_base64url: () => md5_base64url,
  md5_hex: () => md5_hex,
  nanoid: () => nanoid,
  null: () => _null,
  number: () => number,
  rfc5322Email: () => rfc5322Email,
  sha1_base64: () => sha1_base64,
  sha1_base64url: () => sha1_base64url,
  sha1_hex: () => sha1_hex,
  sha256_base64: () => sha256_base64,
  sha256_base64url: () => sha256_base64url,
  sha256_hex: () => sha256_hex,
  sha384_base64: () => sha384_base64,
  sha384_base64url: () => sha384_base64url,
  sha384_hex: () => sha384_hex,
  sha512_base64: () => sha512_base64,
  sha512_base64url: () => sha512_base64url,
  sha512_hex: () => sha512_hex,
  string: () => string,
  time: () => time,
  ulid: () => ulid,
  undefined: () => _undefined,
  unicodeEmail: () => unicodeEmail,
  uppercase: () => uppercase,
  uuid: () => uuid,
  uuid4: () => uuid4,
  uuid6: () => uuid6,
  uuid7: () => uuid7,
  xid: () => xid
});
init_esm();
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = /* @__PURE__ */ __name((version2) => {
  if (!version2)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
}, "uuid");
var uuid4 = /* @__PURE__ */ uuid(4);
var uuid6 = /* @__PURE__ */ uuid(6);
var uuid7 = /* @__PURE__ */ uuid(7);
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
var rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
var idnEmail = unicodeEmail;
var browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
__name(emoji, "emoji");
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var mac = /* @__PURE__ */ __name((delimiter) => {
  const escapedDelim = escapeRegex(delimiter ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${escapedDelim}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${escapedDelim}){5}[0-9a-f]{2}$`);
}, "mac");
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var hostname = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
var domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
__name(timeSource, "timeSource");
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
__name(time, "time");
function datetime(args) {
  const time3 = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time3}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
__name(datetime, "datetime");
var string = /* @__PURE__ */ __name((params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
}, "string");
var bigint = /^-?\d+n?$/;
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var _null = /^null$/i;
var _undefined = /^undefined$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;
var hex = /^[0-9a-fA-F]*$/;
function fixedBase64(bodyLength, padding) {
  return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
}
__name(fixedBase64, "fixedBase64");
function fixedBase64url(length) {
  return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
}
__name(fixedBase64url, "fixedBase64url");
var md5_hex = /^[0-9a-fA-F]{32}$/;
var md5_base64 = /* @__PURE__ */ fixedBase64(22, "==");
var md5_base64url = /* @__PURE__ */ fixedBase64url(22);
var sha1_hex = /^[0-9a-fA-F]{40}$/;
var sha1_base64 = /* @__PURE__ */ fixedBase64(27, "=");
var sha1_base64url = /* @__PURE__ */ fixedBase64url(27);
var sha256_hex = /^[0-9a-fA-F]{64}$/;
var sha256_base64 = /* @__PURE__ */ fixedBase64(43, "=");
var sha256_base64url = /* @__PURE__ */ fixedBase64url(43);
var sha384_hex = /^[0-9a-fA-F]{96}$/;
var sha384_base64 = /* @__PURE__ */ fixedBase64(64, "");
var sha384_base64url = /* @__PURE__ */ fixedBase64url(64);
var sha512_hex = /^[0-9a-fA-F]{128}$/;
var sha512_base64 = /* @__PURE__ */ fixedBase64(86, "==");
var sha512_base64url = /* @__PURE__ */ fixedBase64url(86);

// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def2) => {
  var _a3;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def2;
  (_a3 = inst._zod).onattach ?? (_a3.onattach = []);
});
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  const origin = numericOriginMap[typeof def2.value];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    const curr = (def2.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    if (def2.value < curr) {
      if (def2.inclusive)
        bag.maximum = def2.value;
      else
        bag.exclusiveMaximum = def2.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def2.inclusive ? payload.value <= def2.value : payload.value < def2.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: typeof def2.value === "object" ? def2.value.getTime() : def2.value,
      input: payload.value,
      inclusive: def2.inclusive,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  const origin = numericOriginMap[typeof def2.value];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    const curr = (def2.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    if (def2.value > curr) {
      if (def2.inclusive)
        bag.minimum = def2.value;
      else
        bag.exclusiveMinimum = def2.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def2.inclusive ? payload.value >= def2.value : payload.value > def2.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: typeof def2.value === "object" ? def2.value.getTime() : def2.value,
      input: payload.value,
      inclusive: def2.inclusive,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  inst._zod.onattach.push((inst2) => {
    var _a3;
    (_a3 = inst2._zod.bag).multipleOf ?? (_a3.multipleOf = def2.value);
  });
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def2.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? payload.value % def2.value === BigInt(0) : floatSafeRemainder(payload.value, def2.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def2.value,
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  def2.format = def2.format || "float64";
  const isInt = def2.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def2.format];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def2.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
    if (isInt)
      bag.pattern = integer;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def2.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def2.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def2.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def2.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def2.abort
      });
    }
  };
});
var $ZodCheckBigIntFormat = /* @__PURE__ */ $constructor("$ZodCheckBigIntFormat", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  const [minimum, maximum] = BIGINT_FORMAT_RANGES[def2.format];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def2.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (input < minimum) {
      payload.issues.push({
        origin: "bigint",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def2.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "bigint",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def2.abort
      });
    }
  };
});
var $ZodCheckMaxSize = /* @__PURE__ */ $constructor("$ZodCheckMaxSize", (inst, def2) => {
  var _a3;
  $ZodCheck.init(inst, def2);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.size !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def2.maximum < curr)
      inst2._zod.bag.maximum = def2.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const size = input.size;
    if (size <= def2.maximum)
      return;
    payload.issues.push({
      origin: getSizableOrigin(input),
      code: "too_big",
      maximum: def2.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckMinSize = /* @__PURE__ */ $constructor("$ZodCheckMinSize", (inst, def2) => {
  var _a3;
  $ZodCheck.init(inst, def2);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.size !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def2.minimum > curr)
      inst2._zod.bag.minimum = def2.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const size = input.size;
    if (size >= def2.minimum)
      return;
    payload.issues.push({
      origin: getSizableOrigin(input),
      code: "too_small",
      minimum: def2.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckSizeEquals = /* @__PURE__ */ $constructor("$ZodCheckSizeEquals", (inst, def2) => {
  var _a3;
  $ZodCheck.init(inst, def2);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.size !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.minimum = def2.size;
    bag.maximum = def2.size;
    bag.size = def2.size;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const size = input.size;
    if (size === def2.size)
      return;
    const tooBig = size > def2.size;
    payload.issues.push({
      origin: getSizableOrigin(input),
      ...tooBig ? { code: "too_big", maximum: def2.size } : { code: "too_small", minimum: def2.size },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def2) => {
  var _a3;
  $ZodCheck.init(inst, def2);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def2.maximum < curr)
      inst2._zod.bag.maximum = def2.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def2.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def2.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def2) => {
  var _a3;
  $ZodCheck.init(inst, def2);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def2.minimum > curr)
      inst2._zod.bag.minimum = def2.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def2.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def2.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def2) => {
  var _a3;
  $ZodCheck.init(inst, def2);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.minimum = def2.length;
    bag.maximum = def2.length;
    bag.length = def2.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def2.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def2.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def2.length } : { code: "too_small", minimum: def2.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def2) => {
  var _a3, _b;
  $ZodCheck.init(inst, def2);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def2.format;
    if (def2.pattern) {
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(def2.pattern);
    }
  });
  if (def2.pattern)
    (_a3 = inst._zod).check ?? (_a3.check = (payload) => {
      def2.pattern.lastIndex = 0;
      if (def2.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def2.format,
        input: payload.value,
        ...def2.pattern ? { pattern: def2.pattern.toString() } : {},
        inst,
        continue: !def2.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {
    });
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def2) => {
  $ZodCheckStringFormat.init(inst, def2);
  inst._zod.check = (payload) => {
    def2.pattern.lastIndex = 0;
    if (def2.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def2.pattern.toString(),
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def2) => {
  def2.pattern ?? (def2.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def2);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def2) => {
  def2.pattern ?? (def2.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def2);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  const escapedRegex = escapeRegex(def2.includes);
  const pattern = new RegExp(typeof def2.position === "number" ? `^.{${def2.position}}${escapedRegex}` : escapedRegex);
  def2.pattern = pattern;
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.includes(def2.includes, def2.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def2.includes,
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  const pattern = new RegExp(`^${escapeRegex(def2.prefix)}.*`);
  def2.pattern ?? (def2.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def2.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def2.prefix,
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  const pattern = new RegExp(`.*${escapeRegex(def2.suffix)}$`);
  def2.pattern ?? (def2.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def2.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def2.suffix,
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
function handleCheckPropertyResult(result, payload, property) {
  if (result.issues.length) {
    payload.issues.push(...prefixIssues(property, result.issues));
  }
}
__name(handleCheckPropertyResult, "handleCheckPropertyResult");
var $ZodCheckProperty = /* @__PURE__ */ $constructor("$ZodCheckProperty", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  inst._zod.check = (payload) => {
    const result = def2.schema._zod.run({
      value: payload.value[def2.property],
      issues: []
    }, {});
    if (result instanceof Promise) {
      return result.then((result2) => handleCheckPropertyResult(result2, payload, def2.property));
    }
    handleCheckPropertyResult(result, payload, def2.property);
    return;
  };
});
var $ZodCheckMimeType = /* @__PURE__ */ $constructor("$ZodCheckMimeType", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  const mimeSet = new Set(def2.mime);
  inst._zod.onattach.push((inst2) => {
    inst2._zod.bag.mime = def2.mime;
  });
  inst._zod.check = (payload) => {
    if (mimeSet.has(payload.value.type))
      return;
    payload.issues.push({
      code: "invalid_value",
      values: def2.mime,
      input: payload.value.type,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  inst._zod.check = (payload) => {
    payload.value = def2.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
init_esm();
var Doc = class {
  static {
    __name(this, "Doc");
  }
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split("\n").filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x) => `  ${x}`)];
    return new F(...args, lines.join("\n"));
  }
};

// node_modules/zod/v4/core/versions.js
init_esm();
var version = {
  major: 4,
  minor: 4,
  patch: 3
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def2) => {
  var _a3;
  inst ?? (inst = {});
  inst._zod.def = def2;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst);
  }
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = /* @__PURE__ */ __name((payload, checks2, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks2) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError();
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    }, "runChecks");
    const handleCanaryResult = /* @__PURE__ */ __name((canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    }, "handleCanaryResult");
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary2) => {
            return handleCanaryResult(canary2, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return result.then((result2) => runChecks(result2, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  defineLazy(inst, "~standard", () => ({
    validate: /* @__PURE__ */ __name((value) => {
      try {
        const r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    }, "validate"),
    vendor: "zod",
    version: 1
  }));
});
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag);
  inst._zod.parse = (payload, _) => {
    if (def2.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_2) {
      }
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def2) => {
  $ZodCheckStringFormat.init(inst, def2);
  $ZodString.init(inst, def2);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def2) => {
  def2.pattern ?? (def2.pattern = guid);
  $ZodStringFormat.init(inst, def2);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def2) => {
  if (def2.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def2.version];
    if (v === void 0)
      throw new Error(`Invalid UUID version: "${def2.version}"`);
    def2.pattern ?? (def2.pattern = uuid(v));
  } else
    def2.pattern ?? (def2.pattern = uuid());
  $ZodStringFormat.init(inst, def2);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def2) => {
  def2.pattern ?? (def2.pattern = email);
  $ZodStringFormat.init(inst, def2);
});
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def2) => {
  $ZodStringFormat.init(inst, def2);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      if (!def2.normalize && def2.protocol?.source === httpProtocol.source) {
        if (!/^https?:\/\//i.test(trimmed)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid URL format",
            input: payload.value,
            inst,
            continue: !def2.abort
          });
          return;
        }
      }
      const url3 = new URL(trimmed);
      if (def2.hostname) {
        def2.hostname.lastIndex = 0;
        if (!def2.hostname.test(url3.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def2.hostname.source,
            input: payload.value,
            inst,
            continue: !def2.abort
          });
        }
      }
      if (def2.protocol) {
        def2.protocol.lastIndex = 0;
        if (!def2.protocol.test(url3.protocol.endsWith(":") ? url3.protocol.slice(0, -1) : url3.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def2.protocol.source,
            input: payload.value,
            inst,
            continue: !def2.abort
          });
        }
      }
      if (def2.normalize) {
        payload.value = url3.href;
      } else {
        payload.value = trimmed;
      }
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def2.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def2) => {
  def2.pattern ?? (def2.pattern = emoji());
  $ZodStringFormat.init(inst, def2);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def2) => {
  def2.pattern ?? (def2.pattern = nanoid);
  $ZodStringFormat.init(inst, def2);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def2) => {
  def2.pattern ?? (def2.pattern = cuid);
  $ZodStringFormat.init(inst, def2);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def2) => {
  def2.pattern ?? (def2.pattern = cuid2);
  $ZodStringFormat.init(inst, def2);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def2) => {
  def2.pattern ?? (def2.pattern = ulid);
  $ZodStringFormat.init(inst, def2);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def2) => {
  def2.pattern ?? (def2.pattern = xid);
  $ZodStringFormat.init(inst, def2);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def2) => {
  def2.pattern ?? (def2.pattern = ksuid);
  $ZodStringFormat.init(inst, def2);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def2) => {
  def2.pattern ?? (def2.pattern = datetime(def2));
  $ZodStringFormat.init(inst, def2);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def2) => {
  def2.pattern ?? (def2.pattern = date);
  $ZodStringFormat.init(inst, def2);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def2) => {
  def2.pattern ?? (def2.pattern = time(def2));
  $ZodStringFormat.init(inst, def2);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def2) => {
  def2.pattern ?? (def2.pattern = duration);
  $ZodStringFormat.init(inst, def2);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def2) => {
  def2.pattern ?? (def2.pattern = ipv4);
  $ZodStringFormat.init(inst, def2);
  inst._zod.bag.format = `ipv4`;
});
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def2) => {
  def2.pattern ?? (def2.pattern = ipv6);
  $ZodStringFormat.init(inst, def2);
  inst._zod.bag.format = `ipv6`;
  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def2.abort
      });
    }
  };
});
var $ZodMAC = /* @__PURE__ */ $constructor("$ZodMAC", (inst, def2) => {
  def2.pattern ?? (def2.pattern = mac(def2.delimiter));
  $ZodStringFormat.init(inst, def2);
  inst._zod.bag.format = `mac`;
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def2) => {
  def2.pattern ?? (def2.pattern = cidrv4);
  $ZodStringFormat.init(inst, def2);
});
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def2) => {
  def2.pattern ?? (def2.pattern = cidrv6);
  $ZodStringFormat.init(inst, def2);
  inst._zod.check = (payload) => {
    const parts = payload.value.split("/");
    try {
      if (parts.length !== 2)
        throw new Error();
      const [address, prefix] = parts;
      if (!prefix)
        throw new Error();
      const prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw new Error();
      if (prefixNum < 0 || prefixNum > 128)
        throw new Error();
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def2.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
__name(isValidBase64, "isValidBase64");
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def2) => {
  def2.pattern ?? (def2.pattern = base64);
  $ZodStringFormat.init(inst, def2);
  inst._zod.bag.contentEncoding = "base64";
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return false;
  const base644 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base644.padEnd(Math.ceil(base644.length / 4) * 4, "=");
  return isValidBase64(padded);
}
__name(isValidBase64URL, "isValidBase64URL");
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def2) => {
  def2.pattern ?? (def2.pattern = base64url);
  $ZodStringFormat.init(inst, def2);
  inst._zod.bag.contentEncoding = "base64url";
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def2) => {
  def2.pattern ?? (def2.pattern = e164);
  $ZodStringFormat.init(inst, def2);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
__name(isValidJWT, "isValidJWT");
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def2) => {
  $ZodStringFormat.init(inst, def2);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def2.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodCustomStringFormat = /* @__PURE__ */ $constructor("$ZodCustomStringFormat", (inst, def2) => {
  $ZodStringFormat.init(inst, def2);
  inst._zod.check = (payload) => {
    if (def2.fn(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: def2.format,
      input: payload.value,
      inst,
      continue: !def2.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.pattern = inst._zod.bag.pattern ?? number;
  inst._zod.parse = (payload, _ctx) => {
    if (def2.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def2) => {
  $ZodCheckNumberFormat.init(inst, def2);
  $ZodNumber.init(inst, def2);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def2.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodBigInt = /* @__PURE__ */ $constructor("$ZodBigInt", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.pattern = bigint;
  inst._zod.parse = (payload, _ctx) => {
    if (def2.coerce)
      try {
        payload.value = BigInt(payload.value);
      } catch (_) {
      }
    if (typeof payload.value === "bigint")
      return payload;
    payload.issues.push({
      expected: "bigint",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodBigIntFormat = /* @__PURE__ */ $constructor("$ZodBigIntFormat", (inst, def2) => {
  $ZodCheckBigIntFormat.init(inst, def2);
  $ZodBigInt.init(inst, def2);
});
var $ZodSymbol = /* @__PURE__ */ $constructor("$ZodSymbol", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "symbol")
      return payload;
    payload.issues.push({
      expected: "symbol",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUndefined = /* @__PURE__ */ $constructor("$ZodUndefined", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.pattern = _undefined;
  inst._zod.values = /* @__PURE__ */ new Set([void 0]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "undefined")
      return payload;
    payload.issues.push({
      expected: "undefined",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.pattern = _null;
  inst._zod.values = /* @__PURE__ */ new Set([null]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input === null)
      return payload;
    payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodAny = /* @__PURE__ */ $constructor("$ZodAny", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload) => payload;
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodVoid = /* @__PURE__ */ $constructor("$ZodVoid", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "undefined")
      return payload;
    payload.issues.push({
      expected: "void",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodDate = /* @__PURE__ */ $constructor("$ZodDate", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, _ctx) => {
    if (def2.coerce) {
      try {
        payload.value = new Date(payload.value);
      } catch (_err) {
      }
    }
    const input = payload.value;
    const isDate = input instanceof Date;
    const isValidDate = isDate && !Number.isNaN(input.getTime());
    if (isValidDate)
      return payload;
    payload.issues.push({
      expected: "date",
      code: "invalid_type",
      input,
      ...isDate ? { received: "Invalid Date" } : {},
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
__name(handleArrayResult, "handleArrayResult");
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0; i < input.length; i++) {
      const item = input[i];
      const result = def2.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
  const isPresent = key in input;
  if (result.issues.length) {
    if (isOptionalIn && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && !isOptionalIn) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [key]
      });
    }
    return;
  }
  if (result.value === void 0) {
    if (isPresent) {
      final.value[key] = void 0;
    }
  } else {
    final.value[key] = result.value;
  }
}
__name(handlePropertyResult, "handlePropertyResult");
function normalizeDef(def2) {
  const keys = Object.keys(def2.shape);
  for (const k of keys) {
    if (!def2.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def2.shape);
  return {
    ...def2,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
__name(normalizeDef, "normalizeDef");
function handleCatchall(proms, input, payload, ctx, def2, inst) {
  const unrecognized = [];
  const keySet = def2.keySet;
  const _catchall = def2.catchall._zod;
  const t = _catchall.def.type;
  const isOptionalIn = _catchall.optin === "optional";
  const isOptionalOut = _catchall.optout === "optional";
  for (const key in input) {
    if (key === "__proto__")
      continue;
    if (keySet.has(key))
      continue;
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
    } else {
      handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
__name(handleCatchall, "handleCatchall");
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def2) => {
  $ZodType.init(inst, def2);
  const desc = Object.getOwnPropertyDescriptor(def2, "shape");
  if (!desc?.get) {
    const sh = def2.shape;
    Object.defineProperty(def2, "shape", {
      get: /* @__PURE__ */ __name(() => {
        const newSh = { ...sh };
        Object.defineProperty(def2, "shape", {
          value: newSh
        });
        return newSh;
      }, "get")
    });
  }
  const _normalized = cached(() => normalizeDef(def2));
  defineLazy(inst._zod, "propValues", () => {
    const shape = def2.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
        for (const v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def2.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = {};
    const proms = [];
    const shape = value.shape;
    for (const key of value.keys) {
      const el = shape[key];
      const isOptionalIn = el._zod.optin === "optional";
      const isOptionalOut = el._zod.optout === "optional";
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
      } else {
        handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def2) => {
  $ZodObject.init(inst, def2);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def2));
  const generateFastpass = /* @__PURE__ */ __name((shape) => {
    const doc = new Doc(["shape", "payload", "ctx"]);
    const normalized = _normalized.value;
    const parseStr = /* @__PURE__ */ __name((key) => {
      const k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    }, "parseStr");
    doc.write(`const input = payload.value;`);
    const ids = /* @__PURE__ */ Object.create(null);
    let counter = 0;
    for (const key of normalized.keys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(`const newResult = {};`);
    for (const key of normalized.keys) {
      const id = ids[key];
      const k = esc(key);
      const schema = shape[key];
      const isOptionalIn = schema?._zod?.optin === "optional";
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(key)};`);
      if (isOptionalIn && isOptionalOut) {
        doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    const fn = doc.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  }, "generateFastpass");
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def2.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def2.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
__name(handleUnionResults, "handleUnionResults");
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def2) => {
  $ZodType.init(inst, def2);
  defineLazy(inst._zod, "optin", () => def2.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "optout", () => def2.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "values", () => {
    if (def2.options.every((o) => o._zod.values)) {
      return new Set(def2.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def2.options.every((o) => o._zod.pattern)) {
      const patterns = def2.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return void 0;
  });
  const first = def2.options.length === 1 ? def2.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def2.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleUnionResults(results2, payload, inst, ctx);
    });
  };
});
function handleExclusiveUnionResults(results, final, inst, ctx) {
  const successes = results.filter((r) => r.issues.length === 0);
  if (successes.length === 1) {
    final.value = successes[0].value;
    return final;
  }
  if (successes.length === 0) {
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    });
  } else {
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: [],
      inclusive: false
    });
  }
  return final;
}
__name(handleExclusiveUnionResults, "handleExclusiveUnionResults");
var $ZodXor = /* @__PURE__ */ $constructor("$ZodXor", (inst, def2) => {
  $ZodUnion.init(inst, def2);
  def2.inclusive = false;
  const first = def2.options.length === 1 ? def2.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def2.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        results.push(result);
      }
    }
    if (!async)
      return handleExclusiveUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleExclusiveUnionResults(results2, payload, inst, ctx);
    });
  };
});
var $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def2) => {
  def2.inclusive = false;
  $ZodUnion.init(inst, def2);
  const _super = inst._zod.parse;
  defineLazy(inst._zod, "propValues", () => {
    const propValues = {};
    for (const option of def2.options) {
      const pv = option._zod.propValues;
      if (!pv || Object.keys(pv).length === 0)
        throw new Error(`Invalid discriminated union option at index "${def2.options.indexOf(option)}"`);
      for (const [k, v] of Object.entries(pv)) {
        if (!propValues[k])
          propValues[k] = /* @__PURE__ */ new Set();
        for (const val of v) {
          propValues[k].add(val);
        }
      }
    }
    return propValues;
  });
  const disc = cached(() => {
    const opts = def2.options;
    const map2 = /* @__PURE__ */ new Map();
    for (const o of opts) {
      const values = o._zod.propValues?.[def2.discriminator];
      if (!values || values.size === 0)
        throw new Error(`Invalid discriminated union option at index "${def2.options.indexOf(o)}"`);
      for (const v of values) {
        if (map2.has(v)) {
          throw new Error(`Duplicate discriminator value "${String(v)}"`);
        }
        map2.set(v, o);
      }
    }
    return map2;
  });
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isObject(input)) {
      payload.issues.push({
        code: "invalid_type",
        expected: "object",
        input,
        inst
      });
      return payload;
    }
    const opt = disc.value.get(input?.[def2.discriminator]);
    if (opt) {
      return opt._zod.run(payload, ctx);
    }
    if (def2.unionFallback || ctx.direction === "backward") {
      return _super(payload, ctx);
    }
    payload.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: def2.discriminator,
      options: Array.from(disc.value.keys()),
      input,
      path: [def2.discriminator],
      inst
    });
    return payload;
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def2.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def2.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left2, right2]) => {
        return handleIntersectionResults(payload, left2, right2);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
__name(mergeValues, "mergeValues");
function handleIntersectionResults(result, left, right) {
  const unrecKeys = /* @__PURE__ */ new Map();
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
__name(handleIntersectionResults, "handleIntersectionResults");
var $ZodTuple = /* @__PURE__ */ $constructor("$ZodTuple", (inst, def2) => {
  $ZodType.init(inst, def2);
  const items = def2.items;
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        input,
        inst,
        expected: "tuple",
        code: "invalid_type"
      });
      return payload;
    }
    payload.value = [];
    const proms = [];
    const optinStart = getTupleOptStart(items, "optin");
    const optoutStart = getTupleOptStart(items, "optout");
    if (!def2.rest) {
      if (input.length < optinStart) {
        payload.issues.push({
          code: "too_small",
          minimum: optinStart,
          inclusive: true,
          input,
          inst,
          origin: "array"
        });
        return payload;
      }
      if (input.length > items.length) {
        payload.issues.push({
          code: "too_big",
          maximum: items.length,
          inclusive: true,
          input,
          inst,
          origin: "array"
        });
      }
    }
    const itemResults = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const r = items[i]._zod.run({ value: input[i], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((rr) => {
          itemResults[i] = rr;
        }));
      } else {
        itemResults[i] = r;
      }
    }
    if (def2.rest) {
      let i = items.length - 1;
      const rest = input.slice(items.length);
      for (const el of rest) {
        i++;
        const result = def2.rest._zod.run({ value: el, issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((r) => handleTupleResult(r, payload, i)));
        } else {
          handleTupleResult(result, payload, i);
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => handleTupleResults(itemResults, payload, items, input, optoutStart));
    }
    return handleTupleResults(itemResults, payload, items, input, optoutStart);
  };
});
function getTupleOptStart(items, key) {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i]._zod[key] !== "optional")
      return i + 1;
  }
  return 0;
}
__name(getTupleOptStart, "getTupleOptStart");
function handleTupleResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
__name(handleTupleResult, "handleTupleResult");
function handleTupleResults(itemResults, final, items, input, optoutStart) {
  for (let i = 0; i < items.length; i++) {
    const r = itemResults[i];
    const isPresent = i < input.length;
    if (r.issues.length) {
      if (!isPresent && i >= optoutStart) {
        final.value.length = i;
        break;
      }
      final.issues.push(...prefixIssues(i, r.issues));
    }
    final.value[i] = r.value;
  }
  for (let i = final.value.length - 1; i >= input.length; i--) {
    if (items[i]._zod.optout === "optional" && final.value[i] === void 0) {
      final.value.length = i;
    } else {
      break;
    }
  }
  return final;
}
__name(handleTupleResults, "handleTupleResults");
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def2.keyType._zod.values;
    if (values) {
      payload.value = {};
      const recordKeys = /* @__PURE__ */ new Set();
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          const keyResult = def2.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          const result = def2.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => {
              if (result2.issues.length) {
                payload.issues.push(...prefixIssues(key, result2.issues));
              }
              payload.value[outKey] = result2.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized = unrecognized ?? [];
          unrecognized.push(key);
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized
        });
      }
    } else {
      payload.value = {};
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def2.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def2.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def2.mode === "loose") {
            payload.value[key] = input[key];
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const result = def2.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => {
            if (result2.issues.length) {
              payload.issues.push(...prefixIssues(key, result2.issues));
            }
            payload.value[keyResult.value] = result2.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[keyResult.value] = result.value;
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodMap = /* @__PURE__ */ $constructor("$ZodMap", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!(input instanceof Map)) {
      payload.issues.push({
        expected: "map",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    payload.value = /* @__PURE__ */ new Map();
    for (const [key, value] of input) {
      const keyResult = def2.keyType._zod.run({ value: key, issues: [] }, ctx);
      const valueResult = def2.valueType._zod.run({ value, issues: [] }, ctx);
      if (keyResult instanceof Promise || valueResult instanceof Promise) {
        proms.push(Promise.all([keyResult, valueResult]).then(([keyResult2, valueResult2]) => {
          handleMapResult(keyResult2, valueResult2, payload, key, input, inst, ctx);
        }));
      } else {
        handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
      }
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
  if (keyResult.issues.length) {
    if (propertyKeyTypes.has(typeof key)) {
      final.issues.push(...prefixIssues(key, keyResult.issues));
    } else {
      final.issues.push({
        code: "invalid_key",
        origin: "map",
        input,
        inst,
        issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
    }
  }
  if (valueResult.issues.length) {
    if (propertyKeyTypes.has(typeof key)) {
      final.issues.push(...prefixIssues(key, valueResult.issues));
    } else {
      final.issues.push({
        origin: "map",
        code: "invalid_element",
        input,
        inst,
        key,
        issues: valueResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
    }
  }
  final.value.set(keyResult.value, valueResult.value);
}
__name(handleMapResult, "handleMapResult");
var $ZodSet = /* @__PURE__ */ $constructor("$ZodSet", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!(input instanceof Set)) {
      payload.issues.push({
        input,
        inst,
        expected: "set",
        code: "invalid_type"
      });
      return payload;
    }
    const proms = [];
    payload.value = /* @__PURE__ */ new Set();
    for (const item of input) {
      const result = def2.valueType._zod.run({ value: item, issues: [] }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleSetResult(result2, payload)));
      } else
        handleSetResult(result, payload);
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
function handleSetResult(result, final) {
  if (result.issues.length) {
    final.issues.push(...result.issues);
  }
  final.value.add(result.value);
}
__name(handleSetResult, "handleSetResult");
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def2) => {
  $ZodType.init(inst, def2);
  const values = getEnumValues(def2.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def2) => {
  $ZodType.init(inst, def2);
  if (def2.values.length === 0) {
    throw new Error("Cannot create literal schema with no valid values");
  }
  const values = new Set(def2.values);
  inst._zod.values = values;
  inst._zod.pattern = new RegExp(`^(${def2.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def2.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodFile = /* @__PURE__ */ $constructor("$ZodFile", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input instanceof File)
      return payload;
    payload.issues.push({
      expected: "file",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.optin = "optional";
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def2.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError();
    }
    payload.value = _out;
    payload.fallback = true;
    return payload;
  };
});
function handleOptionalResult(result, input) {
  if (input === void 0 && (result.issues.length || result.fallback)) {
    return { issues: [], value: void 0 };
  }
  return result;
}
__name(handleOptionalResult, "handleOptionalResult");
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def2.innerType._zod.values ? /* @__PURE__ */ new Set([...def2.innerType._zod.values, void 0]) : void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def2.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def2.innerType._zod.optin === "optional") {
      const input = payload.value;
      const result = def2.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, input));
      return handleOptionalResult(result, input);
    }
    if (payload.value === void 0) {
      return payload;
    }
    return def2.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def2) => {
  $ZodOptional.init(inst, def2);
  defineLazy(inst._zod, "values", () => def2.innerType._zod.values);
  defineLazy(inst._zod, "pattern", () => def2.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def2.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def2) => {
  $ZodType.init(inst, def2);
  defineLazy(inst._zod, "optin", () => def2.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def2.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def2.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
  });
  defineLazy(inst._zod, "values", () => {
    return def2.innerType._zod.values ? /* @__PURE__ */ new Set([...def2.innerType._zod.values, null]) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def2.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def2.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def2.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def2.defaultValue;
      return payload;
    }
    const result = def2.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleDefaultResult(result2, def2));
    }
    return handleDefaultResult(result, def2);
  };
});
function handleDefaultResult(payload, def2) {
  if (payload.value === void 0) {
    payload.value = def2.defaultValue;
  }
  return payload;
}
__name(handleDefaultResult, "handleDefaultResult");
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def2.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def2.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def2.defaultValue;
    }
    return def2.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def2) => {
  $ZodType.init(inst, def2);
  defineLazy(inst._zod, "values", () => {
    const v = def2.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def2.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleNonOptionalResult(result2, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
__name(handleNonOptionalResult, "handleNonOptionalResult");
var $ZodSuccess = /* @__PURE__ */ $constructor("$ZodSuccess", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError("ZodSuccess");
    }
    const result = def2.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => {
        payload.value = result2.issues.length === 0;
        return payload;
      });
    }
    payload.value = result.issues.length === 0;
    return payload;
  };
});
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "optout", () => def2.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def2.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def2.innerType._zod.run(payload, ctx);
    }
    const result = def2.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => {
        payload.value = result2.value;
        if (result2.issues.length) {
          payload.value = def2.catchValue({
            ...payload,
            error: {
              issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def2.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
      payload.fallback = true;
    }
    return payload;
  };
});
var $ZodNaN = /* @__PURE__ */ $constructor("$ZodNaN", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
      payload.issues.push({
        input: payload.value,
        inst,
        expected: "nan",
        code: "invalid_type"
      });
      return payload;
    }
    return payload;
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def2) => {
  $ZodType.init(inst, def2);
  defineLazy(inst._zod, "values", () => def2.in._zod.values);
  defineLazy(inst._zod, "optin", () => def2.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def2.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def2.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def2.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handlePipeResult(right2, def2.in, ctx));
      }
      return handlePipeResult(right, def2.in, ctx);
    }
    const left = def2.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left2) => handlePipeResult(left2, def2.out, ctx));
    }
    return handlePipeResult(left, def2.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
__name(handlePipeResult, "handlePipeResult");
var $ZodCodec = /* @__PURE__ */ $constructor("$ZodCodec", (inst, def2) => {
  $ZodType.init(inst, def2);
  defineLazy(inst._zod, "values", () => def2.in._zod.values);
  defineLazy(inst._zod, "optin", () => def2.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def2.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def2.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    const direction = ctx.direction || "forward";
    if (direction === "forward") {
      const left = def2.in._zod.run(payload, ctx);
      if (left instanceof Promise) {
        return left.then((left2) => handleCodecAResult(left2, def2, ctx));
      }
      return handleCodecAResult(left, def2, ctx);
    } else {
      const right = def2.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handleCodecAResult(right2, def2, ctx));
      }
      return handleCodecAResult(right, def2, ctx);
    }
  };
});
function handleCodecAResult(result, def2, ctx) {
  if (result.issues.length) {
    result.aborted = true;
    return result;
  }
  const direction = ctx.direction || "forward";
  if (direction === "forward") {
    const transformed = def2.transform(result.value, result);
    if (transformed instanceof Promise) {
      return transformed.then((value) => handleCodecTxResult(result, value, def2.out, ctx));
    }
    return handleCodecTxResult(result, transformed, def2.out, ctx);
  } else {
    const transformed = def2.reverseTransform(result.value, result);
    if (transformed instanceof Promise) {
      return transformed.then((value) => handleCodecTxResult(result, value, def2.in, ctx));
    }
    return handleCodecTxResult(result, transformed, def2.in, ctx);
  }
}
__name(handleCodecAResult, "handleCodecAResult");
function handleCodecTxResult(left, value, nextSchema, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return nextSchema._zod.run({ value, issues: left.issues }, ctx);
}
__name(handleCodecTxResult, "handleCodecTxResult");
var $ZodPreprocess = /* @__PURE__ */ $constructor("$ZodPreprocess", (inst, def2) => {
  $ZodPipe.init(inst, def2);
});
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def2) => {
  $ZodType.init(inst, def2);
  defineLazy(inst._zod, "propValues", () => def2.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def2.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def2.innerType?._zod?.optin);
  defineLazy(inst._zod, "optout", () => def2.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def2.innerType._zod.run(payload, ctx);
    }
    const result = def2.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
__name(handleReadonlyResult, "handleReadonlyResult");
var $ZodTemplateLiteral = /* @__PURE__ */ $constructor("$ZodTemplateLiteral", (inst, def2) => {
  $ZodType.init(inst, def2);
  const regexParts = [];
  for (const part of def2.parts) {
    if (typeof part === "object" && part !== null) {
      if (!part._zod.pattern) {
        throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
      }
      const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
      if (!source)
        throw new Error(`Invalid template literal part: ${part._zod.traits}`);
      const start = source.startsWith("^") ? 1 : 0;
      const end = source.endsWith("$") ? source.length - 1 : source.length;
      regexParts.push(source.slice(start, end));
    } else if (part === null || primitiveTypes.has(typeof part)) {
      regexParts.push(escapeRegex(`${part}`));
    } else {
      throw new Error(`Invalid template literal part: ${part}`);
    }
  }
  inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
  inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "string") {
      payload.issues.push({
        input: payload.value,
        inst,
        expected: "string",
        code: "invalid_type"
      });
      return payload;
    }
    inst._zod.pattern.lastIndex = 0;
    if (!inst._zod.pattern.test(payload.value)) {
      payload.issues.push({
        input: payload.value,
        inst,
        code: "invalid_format",
        format: def2.format ?? "template_literal",
        pattern: inst._zod.pattern.source
      });
      return payload;
    }
    return payload;
  };
});
var $ZodFunction = /* @__PURE__ */ $constructor("$ZodFunction", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._def = def2;
  inst._zod.def = def2;
  inst.implement = (func) => {
    if (typeof func !== "function") {
      throw new Error("implement() must be called with a function");
    }
    return function(...args) {
      const parsedArgs = inst._def.input ? parse(inst._def.input, args) : args;
      const result = Reflect.apply(func, this, parsedArgs);
      if (inst._def.output) {
        return parse(inst._def.output, result);
      }
      return result;
    };
  };
  inst.implementAsync = (func) => {
    if (typeof func !== "function") {
      throw new Error("implementAsync() must be called with a function");
    }
    return async function(...args) {
      const parsedArgs = inst._def.input ? await parseAsync(inst._def.input, args) : args;
      const result = await Reflect.apply(func, this, parsedArgs);
      if (inst._def.output) {
        return await parseAsync(inst._def.output, result);
      }
      return result;
    };
  };
  inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "function") {
      payload.issues.push({
        code: "invalid_type",
        expected: "function",
        input: payload.value,
        inst
      });
      return payload;
    }
    const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
    if (hasPromiseOutput) {
      payload.value = inst.implementAsync(payload.value);
    } else {
      payload.value = inst.implement(payload.value);
    }
    return payload;
  };
  inst.input = (...args) => {
    const F = inst.constructor;
    if (Array.isArray(args[0])) {
      return new F({
        type: "function",
        input: new $ZodTuple({
          type: "tuple",
          items: args[0],
          rest: args[1]
        }),
        output: inst._def.output
      });
    }
    return new F({
      type: "function",
      input: args[0],
      output: inst._def.output
    });
  };
  inst.output = (output) => {
    const F = inst.constructor;
    return new F({
      type: "function",
      input: inst._def.input,
      output
    });
  };
  return inst;
});
var $ZodPromise = /* @__PURE__ */ $constructor("$ZodPromise", (inst, def2) => {
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, ctx) => {
    return Promise.resolve(payload.value).then((inner) => def2.innerType._zod.run({ value: inner, issues: [] }, ctx));
  };
});
var $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def2) => {
  $ZodType.init(inst, def2);
  defineLazy(inst._zod, "innerType", () => {
    const d = def2;
    if (!d._cachedInner)
      d._cachedInner = def2.getter();
    return d._cachedInner;
  });
  defineLazy(inst._zod, "pattern", () => inst._zod.innerType?._zod?.pattern);
  defineLazy(inst._zod, "propValues", () => inst._zod.innerType?._zod?.propValues);
  defineLazy(inst._zod, "optin", () => inst._zod.innerType?._zod?.optin ?? void 0);
  defineLazy(inst._zod, "optout", () => inst._zod.innerType?._zod?.optout ?? void 0);
  inst._zod.parse = (payload, ctx) => {
    const inner = inst._zod.innerType;
    return inner._zod.run(payload, ctx);
  };
});
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def2) => {
  $ZodCheck.init(inst, def2);
  $ZodType.init(inst, def2);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def2.fn(input);
    if (r instanceof Promise) {
      return r.then((r2) => handleRefineResult(r2, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      // incorporates params.error into issue reporting
      path: [...inst._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !inst._zod.def.abort
      // params: inst._zod.def.params,
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
__name(handleRefineResult, "handleRefineResult");

// node_modules/zod/v4/locales/index.js
var locales_exports = {};
__export(locales_exports, {
  ar: () => ar_default,
  az: () => az_default,
  be: () => be_default,
  bg: () => bg_default,
  ca: () => ca_default,
  cs: () => cs_default,
  da: () => da_default,
  de: () => de_default,
  el: () => el_default,
  en: () => en_default,
  eo: () => eo_default,
  es: () => es_default,
  fa: () => fa_default,
  fi: () => fi_default,
  fr: () => fr_default,
  frCA: () => fr_CA_default,
  he: () => he_default,
  hr: () => hr_default,
  hu: () => hu_default,
  hy: () => hy_default,
  id: () => id_default,
  is: () => is_default,
  it: () => it_default,
  ja: () => ja_default,
  ka: () => ka_default,
  kh: () => kh_default,
  km: () => km_default,
  ko: () => ko_default,
  lt: () => lt_default,
  mk: () => mk_default,
  ms: () => ms_default,
  nl: () => nl_default,
  no: () => no_default,
  ota: () => ota_default,
  pl: () => pl_default,
  ps: () => ps_default,
  pt: () => pt_default,
  ro: () => ro_default,
  ru: () => ru_default,
  sl: () => sl_default,
  sv: () => sv_default,
  ta: () => ta_default,
  th: () => th_default,
  tr: () => tr_default,
  ua: () => ua_default,
  uk: () => uk_default,
  ur: () => ur_default,
  uz: () => uz_default,
  vi: () => vi_default,
  yo: () => yo_default,
  zhCN: () => zh_CN_default,
  zhTW: () => zh_TW_default
});
init_esm();

// node_modules/zod/v4/locales/ar.js
init_esm();
var error = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "حرف", verb: "أن يحوي" },
    file: { unit: "بايت", verb: "أن يحوي" },
    array: { unit: "عنصر", verb: "أن يحوي" },
    set: { unit: "عنصر", verb: "أن يحوي" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "مدخل",
    email: "بريد إلكتروني",
    url: "رابط",
    emoji: "إيموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاريخ ووقت بمعيار ISO",
    date: "تاريخ بمعيار ISO",
    time: "وقت بمعيار ISO",
    duration: "مدة بمعيار ISO",
    ipv4: "عنوان IPv4",
    ipv6: "عنوان IPv6",
    cidrv4: "مدى عناوين بصيغة IPv4",
    cidrv6: "مدى عناوين بصيغة IPv6",
    base64: "نَص بترميز base64-encoded",
    base64url: "نَص بترميز base64url-encoded",
    json_string: "نَص على هيئة JSON",
    e164: "رقم هاتف بمعيار E.164",
    jwt: "JWT",
    template_literal: "مدخل"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `مدخلات غير مقبولة: يفترض إدخال instanceof ${issue2.expected}، ولكن تم إدخال ${received}`;
        }
        return `مدخلات غير مقبولة: يفترض إدخال ${expected}، ولكن تم إدخال ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `مدخلات غير مقبولة: يفترض إدخال ${stringifyPrimitive(issue2.values[0])}`;
        return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return ` أكبر من اللازم: يفترض أن تكون ${issue2.origin ?? "القيمة"} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "عنصر"}`;
        return `أكبر من اللازم: يفترض أن تكون ${issue2.origin ?? "القيمة"} ${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `أصغر من اللازم: يفترض لـ ${issue2.origin} أن يكون ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `أصغر من اللازم: يفترض لـ ${issue2.origin} أن يكون ${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `نَص غير مقبول: يجب أن يبدأ بـ "${issue2.prefix}"`;
        if (_issue.format === "ends_with")
          return `نَص غير مقبول: يجب أن ينتهي بـ "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `نَص غير مقبول: يجب أن يتضمَّن "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `نَص غير مقبول: يجب أن يطابق النمط ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} غير مقبول`;
      }
      case "not_multiple_of":
        return `رقم غير مقبول: يجب أن يكون من مضاعفات ${issue2.divisor}`;
      case "unrecognized_keys":
        return `معرف${issue2.keys.length > 1 ? "ات" : ""} غريب${issue2.keys.length > 1 ? "ة" : ""}: ${joinValues(issue2.keys, "، ")}`;
      case "invalid_key":
        return `معرف غير مقبول في ${issue2.origin}`;
      case "invalid_union":
        return "مدخل غير مقبول";
      case "invalid_element":
        return `مدخل غير مقبول في ${issue2.origin}`;
      default:
        return "مدخل غير مقبول";
    }
  };
}, "error");
function ar_default() {
  return {
    localeError: error()
  };
}
__name(ar_default, "default");

// node_modules/zod/v4/locales/az.js
init_esm();
var error2 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "simvol", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "element", verb: "olmalıdır" },
    set: { unit: "element", verb: "olmalıdır" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Yanlış dəyər: gözlənilən instanceof ${issue2.expected}, daxil olan ${received}`;
        }
        return `Yanlış dəyər: gözlənilən ${expected}, daxil olan ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Yanlış dəyər: gözlənilən ${stringifyPrimitive(issue2.values[0])}`;
        return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Çox böyük: gözlənilən ${issue2.origin ?? "dəyər"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "element"}`;
        return `Çox böyük: gözlənilən ${issue2.origin ?? "dəyər"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Çox kiçik: gözlənilən ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        return `Çox kiçik: gözlənilən ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Yanlış mətn: "${_issue.prefix}" ilə başlamalıdır`;
        if (_issue.format === "ends_with")
          return `Yanlış mətn: "${_issue.suffix}" ilə bitməlidir`;
        if (_issue.format === "includes")
          return `Yanlış mətn: "${_issue.includes}" daxil olmalıdır`;
        if (_issue.format === "regex")
          return `Yanlış mətn: ${_issue.pattern} şablonuna uyğun olmalıdır`;
        return `Yanlış ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Yanlış ədəd: ${issue2.divisor} ilə bölünə bilən olmalıdır`;
      case "unrecognized_keys":
        return `Tanınmayan açar${issue2.keys.length > 1 ? "lar" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} daxilində yanlış açar`;
      case "invalid_union":
        return "Yanlış dəyər";
      case "invalid_element":
        return `${issue2.origin} daxilində yanlış dəyər`;
      default:
        return `Yanlış dəyər`;
    }
  };
}, "error");
function az_default() {
  return {
    localeError: error2()
  };
}
__name(az_default, "default");

// node_modules/zod/v4/locales/be.js
init_esm();
function getBelarusianPlural(count, one, few, many) {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return many;
  }
  if (lastDigit === 1) {
    return one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }
  return many;
}
__name(getBelarusianPlural, "getBelarusianPlural");
var error3 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: {
      unit: {
        one: "сімвал",
        few: "сімвалы",
        many: "сімвалаў"
      },
      verb: "мець"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    file: {
      unit: {
        one: "байт",
        few: "байты",
        many: "байтаў"
      },
      verb: "мець"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "увод",
    email: "email адрас",
    url: "URL",
    emoji: "эмодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата і час",
    date: "ISO дата",
    time: "ISO час",
    duration: "ISO працягласць",
    ipv4: "IPv4 адрас",
    ipv6: "IPv6 адрас",
    cidrv4: "IPv4 дыяпазон",
    cidrv6: "IPv6 дыяпазон",
    base64: "радок у фармаце base64",
    base64url: "радок у фармаце base64url",
    json_string: "JSON радок",
    e164: "нумар E.164",
    jwt: "JWT",
    template_literal: "увод"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "лік",
    array: "масіў"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Няправільны ўвод: чакаўся instanceof ${issue2.expected}, атрымана ${received}`;
        }
        return `Няправільны ўвод: чакаўся ${expected}, атрымана ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Няправільны ўвод: чакалася ${stringifyPrimitive(issue2.values[0])}`;
        return `Няправільны варыянт: чакаўся адзін з ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const maxValue = Number(issue2.maximum);
          const unit = getBelarusianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Занадта вялікі: чакалася, што ${issue2.origin ?? "значэнне"} павінна ${sizing.verb} ${adj}${issue2.maximum.toString()} ${unit}`;
        }
        return `Занадта вялікі: чакалася, што ${issue2.origin ?? "значэнне"} павінна быць ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const minValue = Number(issue2.minimum);
          const unit = getBelarusianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Занадта малы: чакалася, што ${issue2.origin} павінна ${sizing.verb} ${adj}${issue2.minimum.toString()} ${unit}`;
        }
        return `Занадта малы: чакалася, што ${issue2.origin} павінна быць ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Няправільны радок: павінен пачынацца з "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Няправільны радок: павінен заканчвацца на "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Няправільны радок: павінен змяшчаць "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Няправільны радок: павінен адпавядаць шаблону ${_issue.pattern}`;
        return `Няправільны ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Няправільны лік: павінен быць кратным ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Нераспазнаны ${issue2.keys.length > 1 ? "ключы" : "ключ"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Няправільны ключ у ${issue2.origin}`;
      case "invalid_union":
        return "Няправільны ўвод";
      case "invalid_element":
        return `Няправільнае значэнне ў ${issue2.origin}`;
      default:
        return `Няправільны ўвод`;
    }
  };
}, "error");
function be_default() {
  return {
    localeError: error3()
  };
}
__name(be_default, "default");

// node_modules/zod/v4/locales/bg.js
init_esm();
var error4 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "символа", verb: "да съдържа" },
    file: { unit: "байта", verb: "да съдържа" },
    array: { unit: "елемента", verb: "да съдържа" },
    set: { unit: "елемента", verb: "да съдържа" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "вход",
    email: "имейл адрес",
    url: "URL",
    emoji: "емоджи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO време",
    date: "ISO дата",
    time: "ISO време",
    duration: "ISO продължителност",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "base64-кодиран низ",
    base64url: "base64url-кодиран низ",
    json_string: "JSON низ",
    e164: "E.164 номер",
    jwt: "JWT",
    template_literal: "вход"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Невалиден вход: очакван instanceof ${issue2.expected}, получен ${received}`;
        }
        return `Невалиден вход: очакван ${expected}, получен ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Невалиден вход: очакван ${stringifyPrimitive(issue2.values[0])}`;
        return `Невалидна опция: очаквано едно от ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Твърде голямо: очаква се ${issue2.origin ?? "стойност"} да съдържа ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "елемента"}`;
        return `Твърде голямо: очаква се ${issue2.origin ?? "стойност"} да бъде ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Твърде малко: очаква се ${issue2.origin} да съдържа ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Твърде малко: очаква се ${issue2.origin} да бъде ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Невалиден низ: трябва да започва с "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Невалиден низ: трябва да завършва с "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Невалиден низ: трябва да включва "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Невалиден низ: трябва да съвпада с ${_issue.pattern}`;
        let invalid_adj = "Невалиден";
        if (_issue.format === "emoji")
          invalid_adj = "Невалидно";
        if (_issue.format === "datetime")
          invalid_adj = "Невалидно";
        if (_issue.format === "date")
          invalid_adj = "Невалидна";
        if (_issue.format === "time")
          invalid_adj = "Невалидно";
        if (_issue.format === "duration")
          invalid_adj = "Невалидна";
        return `${invalid_adj} ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Невалидно число: трябва да бъде кратно на ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Неразпознат${issue2.keys.length > 1 ? "и" : ""} ключ${issue2.keys.length > 1 ? "ове" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Невалиден ключ в ${issue2.origin}`;
      case "invalid_union":
        return "Невалиден вход";
      case "invalid_element":
        return `Невалидна стойност в ${issue2.origin}`;
      default:
        return `Невалиден вход`;
    }
  };
}, "error");
function bg_default() {
  return {
    localeError: error4()
  };
}
__name(bg_default, "default");

// node_modules/zod/v4/locales/ca.js
init_esm();
var error5 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "caràcters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "entrada",
    email: "adreça electrònica",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "durada ISO",
    ipv4: "adreça IPv4",
    ipv6: "adreça IPv6",
    cidrv4: "rang IPv4",
    cidrv6: "rang IPv6",
    base64: "cadena codificada en base64",
    base64url: "cadena codificada en base64url",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Tipus invàlid: s'esperava instanceof ${issue2.expected}, s'ha rebut ${received}`;
        }
        return `Tipus invàlid: s'esperava ${expected}, s'ha rebut ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Valor invàlid: s'esperava ${stringifyPrimitive(issue2.values[0])}`;
        return `Opció invàlida: s'esperava una de ${joinValues(issue2.values, " o ")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "com a màxim" : "menys de";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Massa gran: s'esperava que ${issue2.origin ?? "el valor"} contingués ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Massa gran: s'esperava que ${issue2.origin ?? "el valor"} fos ${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "com a mínim" : "més de";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Massa petit: s'esperava que ${issue2.origin} contingués ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Massa petit: s'esperava que ${issue2.origin} fos ${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Format invàlid: ha de començar amb "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Format invàlid: ha d'acabar amb "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Format invàlid: ha d'incloure "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Format invàlid: ha de coincidir amb el patró ${_issue.pattern}`;
        return `Format invàlid per a ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Número invàlid: ha de ser múltiple de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Clau${issue2.keys.length > 1 ? "s" : ""} no reconeguda${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Clau invàlida a ${issue2.origin}`;
      case "invalid_union":
        return "Entrada invàlida";
      // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
      case "invalid_element":
        return `Element invàlid a ${issue2.origin}`;
      default:
        return `Entrada invàlida`;
    }
  };
}, "error");
function ca_default() {
  return {
    localeError: error5()
  };
}
__name(ca_default, "default");

// node_modules/zod/v4/locales/cs.js
init_esm();
var error6 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "znaků", verb: "mít" },
    file: { unit: "bajtů", verb: "mít" },
    array: { unit: "prvků", verb: "mít" },
    set: { unit: "prvků", verb: "mít" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "regulární výraz",
    email: "e-mailová adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "datum a čas ve formátu ISO",
    date: "datum ve formátu ISO",
    time: "čas ve formátu ISO",
    duration: "doba trvání ISO",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "rozsah IPv4",
    cidrv6: "rozsah IPv6",
    base64: "řetězec zakódovaný ve formátu base64",
    base64url: "řetězec zakódovaný ve formátu base64url",
    json_string: "řetězec ve formátu JSON",
    e164: "číslo E.164",
    jwt: "JWT",
    template_literal: "vstup"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "číslo",
    string: "řetězec",
    function: "funkce",
    array: "pole"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Neplatný vstup: očekáváno instanceof ${issue2.expected}, obdrženo ${received}`;
        }
        return `Neplatný vstup: očekáváno ${expected}, obdrženo ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Neplatný vstup: očekáváno ${stringifyPrimitive(issue2.values[0])}`;
        return `Neplatná možnost: očekávána jedna z hodnot ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Hodnota je příliš velká: ${issue2.origin ?? "hodnota"} musí mít ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "prvků"}`;
        }
        return `Hodnota je příliš velká: ${issue2.origin ?? "hodnota"} musí být ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Hodnota je příliš malá: ${issue2.origin ?? "hodnota"} musí mít ${adj}${issue2.minimum.toString()} ${sizing.unit ?? "prvků"}`;
        }
        return `Hodnota je příliš malá: ${issue2.origin ?? "hodnota"} musí být ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Neplatný řetězec: musí začínat na "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Neplatný řetězec: musí končit na "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Neplatný řetězec: musí obsahovat "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Neplatný řetězec: musí odpovídat vzoru ${_issue.pattern}`;
        return `Neplatný formát ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Neplatné číslo: musí být násobkem ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Neznámé klíče: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Neplatný klíč v ${issue2.origin}`;
      case "invalid_union":
        return "Neplatný vstup";
      case "invalid_element":
        return `Neplatná hodnota v ${issue2.origin}`;
      default:
        return `Neplatný vstup`;
    }
  };
}, "error");
function cs_default() {
  return {
    localeError: error6()
  };
}
__name(cs_default, "default");

// node_modules/zod/v4/locales/da.js
init_esm();
var error7 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "input",
    email: "e-mailadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslæt",
    date: "ISO-dato",
    time: "ISO-klokkeslæt",
    duration: "ISO-varighed",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodet streng",
    base64url: "base64url-kodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "streng",
    number: "tal",
    boolean: "boolean",
    array: "liste",
    object: "objekt",
    set: "sæt",
    file: "fil"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ugyldigt input: forventede instanceof ${issue2.expected}, fik ${received}`;
        }
        return `Ugyldigt input: forventede ${expected}, fik ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ugyldig værdi: forventede ${stringifyPrimitive(issue2.values[0])}`;
        return `Ugyldigt valg: forventede en af følgende ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing)
          return `For stor: forventede ${origin ?? "value"} ${sizing.verb} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "elementer"}`;
        return `For stor: forventede ${origin ?? "value"} havde ${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing) {
          return `For lille: forventede ${origin} ${sizing.verb} ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `For lille: forventede ${origin} havde ${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Ugyldig streng: skal starte med "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Ugyldig streng: skal ende med "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ugyldig streng: skal indeholde "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ugyldig streng: skal matche mønsteret ${_issue.pattern}`;
        return `Ugyldig ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ugyldigt tal: skal være deleligt med ${issue2.divisor}`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøgle i ${issue2.origin}`;
      case "invalid_union":
        return "Ugyldigt input: matcher ingen af de tilladte typer";
      case "invalid_element":
        return `Ugyldig værdi i ${issue2.origin}`;
      default:
        return `Ugyldigt input`;
    }
  };
}, "error");
function da_default() {
  return {
    localeError: error7()
  };
}
__name(da_default, "default");

// node_modules/zod/v4/locales/de.js
init_esm();
var error8 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "Eingabe",
    email: "E-Mail-Adresse",
    url: "URL",
    emoji: "Emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-Datum und -Uhrzeit",
    date: "ISO-Datum",
    time: "ISO-Uhrzeit",
    duration: "ISO-Dauer",
    ipv4: "IPv4-Adresse",
    ipv6: "IPv6-Adresse",
    cidrv4: "IPv4-Bereich",
    cidrv6: "IPv6-Bereich",
    base64: "Base64-codierter String",
    base64url: "Base64-URL-codierter String",
    json_string: "JSON-String",
    e164: "E.164-Nummer",
    jwt: "JWT",
    template_literal: "Eingabe"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "Zahl",
    array: "Array"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ungültige Eingabe: erwartet instanceof ${issue2.expected}, erhalten ${received}`;
        }
        return `Ungültige Eingabe: erwartet ${expected}, erhalten ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ungültige Eingabe: erwartet ${stringifyPrimitive(issue2.values[0])}`;
        return `Ungültige Option: erwartet eine von ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Zu groß: erwartet, dass ${issue2.origin ?? "Wert"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
        return `Zu groß: erwartet, dass ${issue2.origin ?? "Wert"} ${adj}${issue2.maximum.toString()} ist`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Zu klein: erwartet, dass ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} hat`;
        }
        return `Zu klein: erwartet, dass ${issue2.origin} ${adj}${issue2.minimum.toString()} ist`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Ungültiger String: muss mit "${_issue.prefix}" beginnen`;
        if (_issue.format === "ends_with")
          return `Ungültiger String: muss mit "${_issue.suffix}" enden`;
        if (_issue.format === "includes")
          return `Ungültiger String: muss "${_issue.includes}" enthalten`;
        if (_issue.format === "regex")
          return `Ungültiger String: muss dem Muster ${_issue.pattern} entsprechen`;
        return `Ungültig: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ungültige Zahl: muss ein Vielfaches von ${issue2.divisor} sein`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ungültiger Schlüssel in ${issue2.origin}`;
      case "invalid_union":
        return "Ungültige Eingabe";
      case "invalid_element":
        return `Ungültiger Wert in ${issue2.origin}`;
      default:
        return `Ungültige Eingabe`;
    }
  };
}, "error");
function de_default() {
  return {
    localeError: error8()
  };
}
__name(de_default, "default");

// node_modules/zod/v4/locales/el.js
init_esm();
var error9 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "χαρακτήρες", verb: "να έχει" },
    file: { unit: "bytes", verb: "να έχει" },
    array: { unit: "στοιχεία", verb: "να έχει" },
    set: { unit: "στοιχεία", verb: "να έχει" },
    map: { unit: "καταχωρήσεις", verb: "να έχει" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "είσοδος",
    email: "διεύθυνση email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO ημερομηνία και ώρα",
    date: "ISO ημερομηνία",
    time: "ISO ώρα",
    duration: "ISO διάρκεια",
    ipv4: "διεύθυνση IPv4",
    ipv6: "διεύθυνση IPv6",
    mac: "διεύθυνση MAC",
    cidrv4: "εύρος IPv4",
    cidrv6: "εύρος IPv6",
    base64: "συμβολοσειρά κωδικοποιημένη σε base64",
    base64url: "συμβολοσειρά κωδικοποιημένη σε base64url",
    json_string: "συμβολοσειρά JSON",
    e164: "αριθμός E.164",
    jwt: "JWT",
    template_literal: "είσοδος"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (typeof issue2.expected === "string" && /^[A-Z]/.test(issue2.expected)) {
          return `Μη έγκυρη είσοδος: αναμενόταν instanceof ${issue2.expected}, λήφθηκε ${received}`;
        }
        return `Μη έγκυρη είσοδος: αναμενόταν ${expected}, λήφθηκε ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Μη έγκυρη είσοδος: αναμενόταν ${stringifyPrimitive(issue2.values[0])}`;
        return `Μη έγκυρη επιλογή: αναμενόταν ένα από ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Πολύ μεγάλο: αναμενόταν ${issue2.origin ?? "τιμή"} να έχει ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "στοιχεία"}`;
        return `Πολύ μεγάλο: αναμενόταν ${issue2.origin ?? "τιμή"} να είναι ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Πολύ μικρό: αναμενόταν ${issue2.origin} να έχει ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Πολύ μικρό: αναμενόταν ${issue2.origin} να είναι ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Μη έγκυρη συμβολοσειρά: πρέπει να ξεκινά με "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Μη έγκυρη συμβολοσειρά: πρέπει να τελειώνει με "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Μη έγκυρη συμβολοσειρά: πρέπει να περιέχει "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Μη έγκυρη συμβολοσειρά: πρέπει να ταιριάζει με το μοτίβο ${_issue.pattern}`;
        return `Μη έγκυρο: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Μη έγκυρος αριθμός: πρέπει να είναι πολλαπλάσιο του ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Άγνωστ${issue2.keys.length > 1 ? "α" : "ο"} κλειδ${issue2.keys.length > 1 ? "ιά" : "ί"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Μη έγκυρο κλειδί στο ${issue2.origin}`;
      case "invalid_union":
        return "Μη έγκυρη είσοδος";
      case "invalid_element":
        return `Μη έγκυρη τιμή στο ${issue2.origin}`;
      default:
        return `Μη έγκυρη είσοδος`;
    }
  };
}, "error");
function el_default() {
  return {
    localeError: error9()
  };
}
__name(el_default, "default");

// node_modules/zod/v4/locales/en.js
init_esm();
var error10 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    // Compatibility: "nan" -> "NaN" for display
    nan: "NaN"
    // All other type names omitted - they fall back to raw values via ?? operator
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue2.origin}`;
      case "invalid_union":
        if (issue2.options && Array.isArray(issue2.options) && issue2.options.length > 0) {
          const opts = issue2.options.map((o) => `'${o}'`).join(" | ");
          return `Invalid discriminator value. Expected ${opts}`;
        }
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue2.origin}`;
      default:
        return `Invalid input`;
    }
  };
}, "error");
function en_default() {
  return {
    localeError: error10()
  };
}
__name(en_default, "default");

// node_modules/zod/v4/locales/eo.js
init_esm();
var error11 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "enigo",
    email: "retadreso",
    url: "URL",
    emoji: "emoĝio",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datotempo",
    date: "ISO-dato",
    time: "ISO-tempo",
    duration: "ISO-daŭro",
    ipv4: "IPv4-adreso",
    ipv6: "IPv6-adreso",
    cidrv4: "IPv4-rango",
    cidrv6: "IPv6-rango",
    base64: "64-ume kodita karaktraro",
    base64url: "URL-64-ume kodita karaktraro",
    json_string: "JSON-karaktraro",
    e164: "E.164-nombro",
    jwt: "JWT",
    template_literal: "enigo"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nombro",
    array: "tabelo",
    null: "senvalora"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Nevalida enigo: atendiĝis instanceof ${issue2.expected}, riceviĝis ${received}`;
        }
        return `Nevalida enigo: atendiĝis ${expected}, riceviĝis ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Nevalida enigo: atendiĝis ${stringifyPrimitive(issue2.values[0])}`;
        return `Nevalida opcio: atendiĝis unu el ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Tro granda: atendiĝis ke ${issue2.origin ?? "valoro"} havu ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementojn"}`;
        return `Tro granda: atendiĝis ke ${issue2.origin ?? "valoro"} havu ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Tro malgranda: atendiĝis ke ${issue2.origin} havu ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Tro malgranda: atendiĝis ke ${issue2.origin} estu ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Nevalida karaktraro: devas komenciĝi per "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Nevalida karaktraro: devas finiĝi per "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
        return `Nevalida ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Nevalida nombro: devas esti oblo de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Nekonata${issue2.keys.length > 1 ? "j" : ""} ŝlosilo${issue2.keys.length > 1 ? "j" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Nevalida ŝlosilo en ${issue2.origin}`;
      case "invalid_union":
        return "Nevalida enigo";
      case "invalid_element":
        return `Nevalida valoro en ${issue2.origin}`;
      default:
        return `Nevalida enigo`;
    }
  };
}, "error");
function eo_default() {
  return {
    localeError: error11()
  };
}
__name(eo_default, "default");

// node_modules/zod/v4/locales/es.js
init_esm();
var error12 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "entrada",
    email: "dirección de correo electrónico",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "fecha y hora ISO",
    date: "fecha ISO",
    time: "hora ISO",
    duration: "duración ISO",
    ipv4: "dirección IPv4",
    ipv6: "dirección IPv6",
    cidrv4: "rango IPv4",
    cidrv6: "rango IPv6",
    base64: "cadena codificada en base64",
    base64url: "URL codificada en base64",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "texto",
    number: "número",
    boolean: "booleano",
    array: "arreglo",
    object: "objeto",
    set: "conjunto",
    file: "archivo",
    date: "fecha",
    bigint: "número grande",
    symbol: "símbolo",
    undefined: "indefinido",
    null: "nulo",
    function: "función",
    map: "mapa",
    record: "registro",
    tuple: "tupla",
    enum: "enumeración",
    union: "unión",
    literal: "literal",
    promise: "promesa",
    void: "vacío",
    never: "nunca",
    unknown: "desconocido",
    any: "cualquiera"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Entrada inválida: se esperaba instanceof ${issue2.expected}, recibido ${received}`;
        }
        return `Entrada inválida: se esperaba ${expected}, recibido ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Entrada inválida: se esperaba ${stringifyPrimitive(issue2.values[0])}`;
        return `Opción inválida: se esperaba una de ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing)
          return `Demasiado grande: se esperaba que ${origin ?? "valor"} tuviera ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementos"}`;
        return `Demasiado grande: se esperaba que ${origin ?? "valor"} fuera ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing) {
          return `Demasiado pequeño: se esperaba que ${origin} tuviera ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Demasiado pequeño: se esperaba que ${origin} fuera ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Cadena inválida: debe comenzar con "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Cadena inválida: debe terminar en "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Cadena inválida: debe incluir "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Cadena inválida: debe coincidir con el patrón ${_issue.pattern}`;
        return `Inválido ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Número inválido: debe ser múltiplo de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Llave${issue2.keys.length > 1 ? "s" : ""} desconocida${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Llave inválida en ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido en ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
      default:
        return `Entrada inválida`;
    }
  };
}, "error");
function es_default() {
  return {
    localeError: error12()
  };
}
__name(es_default, "default");

// node_modules/zod/v4/locales/fa.js
init_esm();
var error13 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "کاراکتر", verb: "داشته باشد" },
    file: { unit: "بایت", verb: "داشته باشد" },
    array: { unit: "آیتم", verb: "داشته باشد" },
    set: { unit: "آیتم", verb: "داشته باشد" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "ورودی",
    email: "آدرس ایمیل",
    url: "URL",
    emoji: "ایموجی",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاریخ و زمان ایزو",
    date: "تاریخ ایزو",
    time: "زمان ایزو",
    duration: "مدت زمان ایزو",
    ipv4: "IPv4 آدرس",
    ipv6: "IPv6 آدرس",
    cidrv4: "IPv4 دامنه",
    cidrv6: "IPv6 دامنه",
    base64: "base64-encoded رشته",
    base64url: "base64url-encoded رشته",
    json_string: "JSON رشته",
    e164: "E.164 عدد",
    jwt: "JWT",
    template_literal: "ورودی"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "عدد",
    array: "آرایه"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `ورودی نامعتبر: می‌بایست instanceof ${issue2.expected} می‌بود، ${received} دریافت شد`;
        }
        return `ورودی نامعتبر: می‌بایست ${expected} می‌بود، ${received} دریافت شد`;
      }
      case "invalid_value":
        if (issue2.values.length === 1) {
          return `ورودی نامعتبر: می‌بایست ${stringifyPrimitive(issue2.values[0])} می‌بود`;
        }
        return `گزینه نامعتبر: می‌بایست یکی از ${joinValues(issue2.values, "|")} می‌بود`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `خیلی بزرگ: ${issue2.origin ?? "مقدار"} باید ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "عنصر"} باشد`;
        }
        return `خیلی بزرگ: ${issue2.origin ?? "مقدار"} باید ${adj}${issue2.maximum.toString()} باشد`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `خیلی کوچک: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} ${sizing.unit} باشد`;
        }
        return `خیلی کوچک: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} باشد`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `رشته نامعتبر: باید با "${_issue.prefix}" شروع شود`;
        }
        if (_issue.format === "ends_with") {
          return `رشته نامعتبر: باید با "${_issue.suffix}" تمام شود`;
        }
        if (_issue.format === "includes") {
          return `رشته نامعتبر: باید شامل "${_issue.includes}" باشد`;
        }
        if (_issue.format === "regex") {
          return `رشته نامعتبر: باید با الگوی ${_issue.pattern} مطابقت داشته باشد`;
        }
        return `${FormatDictionary[_issue.format] ?? issue2.format} نامعتبر`;
      }
      case "not_multiple_of":
        return `عدد نامعتبر: باید مضرب ${issue2.divisor} باشد`;
      case "unrecognized_keys":
        return `کلید${issue2.keys.length > 1 ? "های" : ""} ناشناس: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `کلید ناشناس در ${issue2.origin}`;
      case "invalid_union":
        return `ورودی نامعتبر`;
      case "invalid_element":
        return `مقدار نامعتبر در ${issue2.origin}`;
      default:
        return `ورودی نامعتبر`;
    }
  };
}, "error");
function fa_default() {
  return {
    localeError: error13()
  };
}
__name(fa_default, "default");

// node_modules/zod/v4/locales/fi.js
init_esm();
var error14 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "merkkiä", subject: "merkkijonon" },
    file: { unit: "tavua", subject: "tiedoston" },
    array: { unit: "alkiota", subject: "listan" },
    set: { unit: "alkiota", subject: "joukon" },
    number: { unit: "", subject: "luvun" },
    bigint: { unit: "", subject: "suuren kokonaisluvun" },
    int: { unit: "", subject: "kokonaisluvun" },
    date: { unit: "", subject: "päivämäärän" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "säännöllinen lauseke",
    email: "sähköpostiosoite",
    url: "URL-osoite",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-aikaleima",
    date: "ISO-päivämäärä",
    time: "ISO-aika",
    duration: "ISO-kesto",
    ipv4: "IPv4-osoite",
    ipv6: "IPv6-osoite",
    cidrv4: "IPv4-alue",
    cidrv6: "IPv6-alue",
    base64: "base64-koodattu merkkijono",
    base64url: "base64url-koodattu merkkijono",
    json_string: "JSON-merkkijono",
    e164: "E.164-luku",
    jwt: "JWT",
    template_literal: "templaattimerkkijono"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Virheellinen tyyppi: odotettiin instanceof ${issue2.expected}, oli ${received}`;
        }
        return `Virheellinen tyyppi: odotettiin ${expected}, oli ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Virheellinen syöte: täytyy olla ${stringifyPrimitive(issue2.values[0])}`;
        return `Virheellinen valinta: täytyy olla yksi seuraavista: ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Liian suuri: ${sizing.subject} täytyy olla ${adj}${issue2.maximum.toString()} ${sizing.unit}`.trim();
        }
        return `Liian suuri: arvon täytyy olla ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Liian pieni: ${sizing.subject} täytyy olla ${adj}${issue2.minimum.toString()} ${sizing.unit}`.trim();
        }
        return `Liian pieni: arvon täytyy olla ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Virheellinen syöte: täytyy alkaa "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Virheellinen syöte: täytyy loppua "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Virheellinen syöte: täytyy sisältää "${_issue.includes}"`;
        if (_issue.format === "regex") {
          return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_issue.pattern}`;
        }
        return `Virheellinen ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Virheellinen luku: täytyy olla luvun ${issue2.divisor} monikerta`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return "Virheellinen avain tietueessa";
      case "invalid_union":
        return "Virheellinen unioni";
      case "invalid_element":
        return "Virheellinen arvo joukossa";
      default:
        return `Virheellinen syöte`;
    }
  };
}, "error");
function fi_default() {
  return {
    localeError: error14()
  };
}
__name(fi_default, "default");

// node_modules/zod/v4/locales/fr.js
init_esm();
var error15 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "entrée",
    email: "adresse e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date et heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  };
  const TypeDictionary = {
    string: "chaîne",
    number: "nombre",
    int: "entier",
    boolean: "booléen",
    bigint: "grand entier",
    symbol: "symbole",
    undefined: "indéfini",
    null: "null",
    never: "jamais",
    void: "vide",
    date: "date",
    array: "tableau",
    object: "objet",
    tuple: "tuple",
    record: "enregistrement",
    map: "carte",
    set: "ensemble",
    file: "fichier",
    nonoptional: "non-optionnel",
    nan: "NaN",
    function: "fonction"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Entrée invalide : instanceof ${issue2.expected} attendu, ${received} reçu`;
        }
        return `Entrée invalide : ${expected} attendu, ${received} reçu`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Entrée invalide : ${stringifyPrimitive(issue2.values[0])} attendu`;
        return `Option invalide : une valeur parmi ${joinValues(issue2.values, "|")} attendue`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Trop grand : ${TypeDictionary[issue2.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "élément(s)"}`;
        return `Trop grand : ${TypeDictionary[issue2.origin] ?? "valeur"} doit être ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Trop petit : ${TypeDictionary[issue2.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        return `Trop petit : ${TypeDictionary[issue2.origin] ?? "valeur"} doit être ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Chaîne invalide : doit inclure "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Chaîne invalide : doit correspondre au modèle ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Clé${issue2.keys.length > 1 ? "s" : ""} non reconnue${issue2.keys.length > 1 ? "s" : ""} : ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${issue2.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${issue2.origin}`;
      default:
        return `Entrée invalide`;
    }
  };
}, "error");
function fr_default() {
  return {
    localeError: error15()
  };
}
__name(fr_default, "default");

// node_modules/zod/v4/locales/fr-CA.js
init_esm();
var error16 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "entrée",
    email: "adresse courriel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date-heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Entrée invalide : attendu instanceof ${issue2.expected}, reçu ${received}`;
        }
        return `Entrée invalide : attendu ${expected}, reçu ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Entrée invalide : attendu ${stringifyPrimitive(issue2.values[0])}`;
        return `Option invalide : attendu l'une des valeurs suivantes ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "≤" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Trop grand : attendu que ${issue2.origin ?? "la valeur"} ait ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
        return `Trop grand : attendu que ${issue2.origin ?? "la valeur"} soit ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "≥" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Trop petit : attendu que ${issue2.origin} ait ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Trop petit : attendu que ${issue2.origin} soit ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Chaîne invalide : doit inclure "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Chaîne invalide : doit correspondre au motif ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Clé${issue2.keys.length > 1 ? "s" : ""} non reconnue${issue2.keys.length > 1 ? "s" : ""} : ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${issue2.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${issue2.origin}`;
      default:
        return `Entrée invalide`;
    }
  };
}, "error");
function fr_CA_default() {
  return {
    localeError: error16()
  };
}
__name(fr_CA_default, "default");

// node_modules/zod/v4/locales/he.js
init_esm();
var error17 = /* @__PURE__ */ __name(() => {
  const TypeNames = {
    string: { label: "מחרוזת", gender: "f" },
    number: { label: "מספר", gender: "m" },
    boolean: { label: "ערך בוליאני", gender: "m" },
    bigint: { label: "BigInt", gender: "m" },
    date: { label: "תאריך", gender: "m" },
    array: { label: "מערך", gender: "m" },
    object: { label: "אובייקט", gender: "m" },
    null: { label: "ערך ריק (null)", gender: "m" },
    undefined: { label: "ערך לא מוגדר (undefined)", gender: "m" },
    symbol: { label: "סימבול (Symbol)", gender: "m" },
    function: { label: "פונקציה", gender: "f" },
    map: { label: "מפה (Map)", gender: "f" },
    set: { label: "קבוצה (Set)", gender: "f" },
    file: { label: "קובץ", gender: "m" },
    promise: { label: "Promise", gender: "m" },
    NaN: { label: "NaN", gender: "m" },
    unknown: { label: "ערך לא ידוע", gender: "m" },
    value: { label: "ערך", gender: "m" }
  };
  const Sizable = {
    string: { unit: "תווים", shortLabel: "קצר", longLabel: "ארוך" },
    file: { unit: "בייטים", shortLabel: "קטן", longLabel: "גדול" },
    array: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    set: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    number: { unit: "", shortLabel: "קטן", longLabel: "גדול" }
    // no unit
  };
  const typeEntry = /* @__PURE__ */ __name((t) => t ? TypeNames[t] : void 0, "typeEntry");
  const typeLabel = /* @__PURE__ */ __name((t) => {
    const e = typeEntry(t);
    if (e)
      return e.label;
    return t ?? TypeNames.unknown.label;
  }, "typeLabel");
  const withDefinite = /* @__PURE__ */ __name((t) => `ה${typeLabel(t)}`, "withDefinite");
  const verbFor = /* @__PURE__ */ __name((t) => {
    const e = typeEntry(t);
    const gender = e?.gender ?? "m";
    return gender === "f" ? "צריכה להיות" : "צריך להיות";
  }, "verbFor");
  const getSizing = /* @__PURE__ */ __name((origin) => {
    if (!origin)
      return null;
    return Sizable[origin] ?? null;
  }, "getSizing");
  const FormatDictionary = {
    regex: { label: "קלט", gender: "m" },
    email: { label: "כתובת אימייל", gender: "f" },
    url: { label: "כתובת רשת", gender: "f" },
    emoji: { label: "אימוג'י", gender: "m" },
    uuid: { label: "UUID", gender: "m" },
    nanoid: { label: "nanoid", gender: "m" },
    guid: { label: "GUID", gender: "m" },
    cuid: { label: "cuid", gender: "m" },
    cuid2: { label: "cuid2", gender: "m" },
    ulid: { label: "ULID", gender: "m" },
    xid: { label: "XID", gender: "m" },
    ksuid: { label: "KSUID", gender: "m" },
    datetime: { label: "תאריך וזמן ISO", gender: "m" },
    date: { label: "תאריך ISO", gender: "m" },
    time: { label: "זמן ISO", gender: "m" },
    duration: { label: "משך זמן ISO", gender: "m" },
    ipv4: { label: "כתובת IPv4", gender: "f" },
    ipv6: { label: "כתובת IPv6", gender: "f" },
    cidrv4: { label: "טווח IPv4", gender: "m" },
    cidrv6: { label: "טווח IPv6", gender: "m" },
    base64: { label: "מחרוזת בבסיס 64", gender: "f" },
    base64url: { label: "מחרוזת בבסיס 64 לכתובות רשת", gender: "f" },
    json_string: { label: "מחרוזת JSON", gender: "f" },
    e164: { label: "מספר E.164", gender: "m" },
    jwt: { label: "JWT", gender: "m" },
    ends_with: { label: "קלט", gender: "m" },
    includes: { label: "קלט", gender: "m" },
    lowercase: { label: "קלט", gender: "m" },
    starts_with: { label: "קלט", gender: "m" },
    uppercase: { label: "קלט", gender: "m" }
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expectedKey = issue2.expected;
        const expected = TypeDictionary[expectedKey ?? ""] ?? typeLabel(expectedKey);
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? TypeNames[receivedType]?.label ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `קלט לא תקין: צריך להיות instanceof ${issue2.expected}, התקבל ${received}`;
        }
        return `קלט לא תקין: צריך להיות ${expected}, התקבל ${received}`;
      }
      case "invalid_value": {
        if (issue2.values.length === 1) {
          return `ערך לא תקין: הערך חייב להיות ${stringifyPrimitive(issue2.values[0])}`;
        }
        const stringified = issue2.values.map((v) => stringifyPrimitive(v));
        if (issue2.values.length === 2) {
          return `ערך לא תקין: האפשרויות המתאימות הן ${stringified[0]} או ${stringified[1]}`;
        }
        const lastValue = stringified[stringified.length - 1];
        const restValues = stringified.slice(0, -1).join(", ");
        return `ערך לא תקין: האפשרויות המתאימות הן ${restValues} או ${lastValue}`;
      }
      case "too_big": {
        const sizing = getSizing(issue2.origin);
        const subject = withDefinite(issue2.origin ?? "value");
        if (issue2.origin === "string") {
          return `${sizing?.longLabel ?? "ארוך"} מדי: ${subject} צריכה להכיל ${issue2.maximum.toString()} ${sizing?.unit ?? ""} ${issue2.inclusive ? "או פחות" : "לכל היותר"}`.trim();
        }
        if (issue2.origin === "number") {
          const comparison = issue2.inclusive ? `קטן או שווה ל-${issue2.maximum}` : `קטן מ-${issue2.maximum}`;
          return `גדול מדי: ${subject} צריך להיות ${comparison}`;
        }
        if (issue2.origin === "array" || issue2.origin === "set") {
          const verb = issue2.origin === "set" ? "צריכה" : "צריך";
          const comparison = issue2.inclusive ? `${issue2.maximum} ${sizing?.unit ?? ""} או פחות` : `פחות מ-${issue2.maximum} ${sizing?.unit ?? ""}`;
          return `גדול מדי: ${subject} ${verb} להכיל ${comparison}`.trim();
        }
        const adj = issue2.inclusive ? "<=" : "<";
        const be = verbFor(issue2.origin ?? "value");
        if (sizing?.unit) {
          return `${sizing.longLabel} מדי: ${subject} ${be} ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
        }
        return `${sizing?.longLabel ?? "גדול"} מדי: ${subject} ${be} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const sizing = getSizing(issue2.origin);
        const subject = withDefinite(issue2.origin ?? "value");
        if (issue2.origin === "string") {
          return `${sizing?.shortLabel ?? "קצר"} מדי: ${subject} צריכה להכיל ${issue2.minimum.toString()} ${sizing?.unit ?? ""} ${issue2.inclusive ? "או יותר" : "לפחות"}`.trim();
        }
        if (issue2.origin === "number") {
          const comparison = issue2.inclusive ? `גדול או שווה ל-${issue2.minimum}` : `גדול מ-${issue2.minimum}`;
          return `קטן מדי: ${subject} צריך להיות ${comparison}`;
        }
        if (issue2.origin === "array" || issue2.origin === "set") {
          const verb = issue2.origin === "set" ? "צריכה" : "צריך";
          if (issue2.minimum === 1 && issue2.inclusive) {
            const singularPhrase = issue2.origin === "set" ? "לפחות פריט אחד" : "לפחות פריט אחד";
            return `קטן מדי: ${subject} ${verb} להכיל ${singularPhrase}`;
          }
          const comparison = issue2.inclusive ? `${issue2.minimum} ${sizing?.unit ?? ""} או יותר` : `יותר מ-${issue2.minimum} ${sizing?.unit ?? ""}`;
          return `קטן מדי: ${subject} ${verb} להכיל ${comparison}`.trim();
        }
        const adj = issue2.inclusive ? ">=" : ">";
        const be = verbFor(issue2.origin ?? "value");
        if (sizing?.unit) {
          return `${sizing.shortLabel} מדי: ${subject} ${be} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `${sizing?.shortLabel ?? "קטן"} מדי: ${subject} ${be} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `המחרוזת חייבת להתחיל ב "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `המחרוזת חייבת להסתיים ב "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `המחרוזת חייבת לכלול "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `המחרוזת חייבת להתאים לתבנית ${_issue.pattern}`;
        const nounEntry = FormatDictionary[_issue.format];
        const noun = nounEntry?.label ?? _issue.format;
        const gender = nounEntry?.gender ?? "m";
        const adjective = gender === "f" ? "תקינה" : "תקין";
        return `${noun} לא ${adjective}`;
      }
      case "not_multiple_of":
        return `מספר לא תקין: חייב להיות מכפלה של ${issue2.divisor}`;
      case "unrecognized_keys":
        return `מפתח${issue2.keys.length > 1 ? "ות" : ""} לא מזוה${issue2.keys.length > 1 ? "ים" : "ה"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key": {
        return `שדה לא תקין באובייקט`;
      }
      case "invalid_union":
        return "קלט לא תקין";
      case "invalid_element": {
        const place = withDefinite(issue2.origin ?? "array");
        return `ערך לא תקין ב${place}`;
      }
      default:
        return `קלט לא תקין`;
    }
  };
}, "error");
function he_default() {
  return {
    localeError: error17()
  };
}
__name(he_default, "default");

// node_modules/zod/v4/locales/hr.js
init_esm();
var error18 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "znakova", verb: "imati" },
    file: { unit: "bajtova", verb: "imati" },
    array: { unit: "stavki", verb: "imati" },
    set: { unit: "stavki", verb: "imati" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "unos",
    email: "email adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum i vrijeme",
    date: "ISO datum",
    time: "ISO vrijeme",
    duration: "ISO trajanje",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "IPv4 raspon",
    cidrv6: "IPv6 raspon",
    base64: "base64 kodirani tekst",
    base64url: "base64url kodirani tekst",
    json_string: "JSON tekst",
    e164: "E.164 broj",
    jwt: "JWT",
    template_literal: "unos"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "tekst",
    number: "broj",
    boolean: "boolean",
    array: "niz",
    object: "objekt",
    set: "skup",
    file: "datoteka",
    date: "datum",
    bigint: "bigint",
    symbol: "simbol",
    undefined: "undefined",
    null: "null",
    function: "funkcija",
    map: "mapa"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Neispravan unos: očekuje se instanceof ${issue2.expected}, a primljeno je ${received}`;
        }
        return `Neispravan unos: očekuje se ${expected}, a primljeno je ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Neispravna vrijednost: očekivano ${stringifyPrimitive(issue2.values[0])}`;
        return `Neispravna opcija: očekivano jedno od ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing)
          return `Preveliko: očekivano da ${origin ?? "vrijednost"} ima ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemenata"}`;
        return `Preveliko: očekivano da ${origin ?? "vrijednost"} bude ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing) {
          return `Premalo: očekivano da ${origin} ima ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Premalo: očekivano da ${origin} bude ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Neispravan tekst: mora započinjati s "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Neispravan tekst: mora završavati s "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Neispravan tekst: mora sadržavati "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Neispravan tekst: mora odgovarati uzorku ${_issue.pattern}`;
        return `Neispravna ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Neispravan broj: mora biti višekratnik od ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznat${issue2.keys.length > 1 ? "i ključevi" : " ključ"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Neispravan ključ u ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
      case "invalid_union":
        return "Neispravan unos";
      case "invalid_element":
        return `Neispravna vrijednost u ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
      default:
        return `Neispravan unos`;
    }
  };
}, "error");
function hr_default() {
  return {
    localeError: error18()
  };
}
__name(hr_default, "default");

// node_modules/zod/v4/locales/hu.js
init_esm();
var error19 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "bemenet",
    email: "email cím",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO időbélyeg",
    date: "ISO dátum",
    time: "ISO idő",
    duration: "ISO időintervallum",
    ipv4: "IPv4 cím",
    ipv6: "IPv6 cím",
    cidrv4: "IPv4 tartomány",
    cidrv6: "IPv6 tartomány",
    base64: "base64-kódolt string",
    base64url: "base64url-kódolt string",
    json_string: "JSON string",
    e164: "E.164 szám",
    jwt: "JWT",
    template_literal: "bemenet"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "szám",
    array: "tömb"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Érvénytelen bemenet: a várt érték instanceof ${issue2.expected}, a kapott érték ${received}`;
        }
        return `Érvénytelen bemenet: a várt érték ${expected}, a kapott érték ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Érvénytelen bemenet: a várt érték ${stringifyPrimitive(issue2.values[0])}`;
        return `Érvénytelen opció: valamelyik érték várt ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Túl nagy: ${issue2.origin ?? "érték"} mérete túl nagy ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elem"}`;
        return `Túl nagy: a bemeneti érték ${issue2.origin ?? "érték"} túl nagy: ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Túl kicsi: a bemeneti érték ${issue2.origin} mérete túl kicsi ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Túl kicsi: a bemeneti érték ${issue2.origin} túl kicsi ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Érvénytelen string: "${_issue.prefix}" értékkel kell kezdődnie`;
        if (_issue.format === "ends_with")
          return `Érvénytelen string: "${_issue.suffix}" értékkel kell végződnie`;
        if (_issue.format === "includes")
          return `Érvénytelen string: "${_issue.includes}" értéket kell tartalmaznia`;
        if (_issue.format === "regex")
          return `Érvénytelen string: ${_issue.pattern} mintának kell megfelelnie`;
        return `Érvénytelen ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Érvénytelen szám: ${issue2.divisor} többszörösének kell lennie`;
      case "unrecognized_keys":
        return `Ismeretlen kulcs${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Érvénytelen kulcs ${issue2.origin}`;
      case "invalid_union":
        return "Érvénytelen bemenet";
      case "invalid_element":
        return `Érvénytelen érték: ${issue2.origin}`;
      default:
        return `Érvénytelen bemenet`;
    }
  };
}, "error");
function hu_default() {
  return {
    localeError: error19()
  };
}
__name(hu_default, "default");

// node_modules/zod/v4/locales/hy.js
init_esm();
function getArmenianPlural(count, one, many) {
  return Math.abs(count) === 1 ? one : many;
}
__name(getArmenianPlural, "getArmenianPlural");
function withDefiniteArticle(word) {
  if (!word)
    return "";
  const vowels = ["ա", "ե", "ը", "ի", "ո", "ու", "օ"];
  const lastChar = word[word.length - 1];
  return word + (vowels.includes(lastChar) ? "ն" : "ը");
}
__name(withDefiniteArticle, "withDefiniteArticle");
var error20 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: {
      unit: {
        one: "նշան",
        many: "նշաններ"
      },
      verb: "ունենալ"
    },
    file: {
      unit: {
        one: "բայթ",
        many: "բայթեր"
      },
      verb: "ունենալ"
    },
    array: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    },
    set: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "մուտք",
    email: "էլ. հասցե",
    url: "URL",
    emoji: "էմոջի",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO ամսաթիվ և ժամ",
    date: "ISO ամսաթիվ",
    time: "ISO ժամ",
    duration: "ISO տևողություն",
    ipv4: "IPv4 հասցե",
    ipv6: "IPv6 հասցե",
    cidrv4: "IPv4 միջակայք",
    cidrv6: "IPv6 միջակայք",
    base64: "base64 ձևաչափով տող",
    base64url: "base64url ձևաչափով տող",
    json_string: "JSON տող",
    e164: "E.164 համար",
    jwt: "JWT",
    template_literal: "մուտք"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "թիվ",
    array: "զանգված"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Սխալ մուտքագրում․ սպասվում էր instanceof ${issue2.expected}, ստացվել է ${received}`;
        }
        return `Սխալ մուտքագրում․ սպասվում էր ${expected}, ստացվել է ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Սխալ մուտքագրում․ սպասվում էր ${stringifyPrimitive(issue2.values[1])}`;
        return `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const maxValue = Number(issue2.maximum);
          const unit = getArmenianPlural(maxValue, sizing.unit.one, sizing.unit.many);
          return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle(issue2.origin ?? "արժեք")} կունենա ${adj}${issue2.maximum.toString()} ${unit}`;
        }
        return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle(issue2.origin ?? "արժեք")} լինի ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const minValue = Number(issue2.minimum);
          const unit = getArmenianPlural(minValue, sizing.unit.one, sizing.unit.many);
          return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue2.origin)} կունենա ${adj}${issue2.minimum.toString()} ${unit}`;
        }
        return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue2.origin)} լինի ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Սխալ տող․ պետք է սկսվի "${_issue.prefix}"-ով`;
        if (_issue.format === "ends_with")
          return `Սխալ տող․ պետք է ավարտվի "${_issue.suffix}"-ով`;
        if (_issue.format === "includes")
          return `Սխալ տող․ պետք է պարունակի "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Սխալ տող․ պետք է համապատասխանի ${_issue.pattern} ձևաչափին`;
        return `Սխալ ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${issue2.divisor}-ի`;
      case "unrecognized_keys":
        return `Չճանաչված բանալի${issue2.keys.length > 1 ? "ներ" : ""}. ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Սխալ բանալի ${withDefiniteArticle(issue2.origin)}-ում`;
      case "invalid_union":
        return "Սխալ մուտքագրում";
      case "invalid_element":
        return `Սխալ արժեք ${withDefiniteArticle(issue2.origin)}-ում`;
      default:
        return `Սխալ մուտքագրում`;
    }
  };
}, "error");
function hy_default() {
  return {
    localeError: error20()
  };
}
__name(hy_default, "default");

// node_modules/zod/v4/locales/id.js
init_esm();
var error21 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "input",
    email: "alamat email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tanggal dan waktu format ISO",
    date: "tanggal format ISO",
    time: "jam format ISO",
    duration: "durasi format ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "rentang alamat IPv4",
    cidrv6: "rentang alamat IPv6",
    base64: "string dengan enkode base64",
    base64url: "string dengan enkode base64url",
    json_string: "string JSON",
    e164: "angka E.164",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Input tidak valid: diharapkan instanceof ${issue2.expected}, diterima ${received}`;
        }
        return `Input tidak valid: diharapkan ${expected}, diterima ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Input tidak valid: diharapkan ${stringifyPrimitive(issue2.values[0])}`;
        return `Pilihan tidak valid: diharapkan salah satu dari ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Terlalu besar: diharapkan ${issue2.origin ?? "value"} memiliki ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemen"}`;
        return `Terlalu besar: diharapkan ${issue2.origin ?? "value"} menjadi ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Terlalu kecil: diharapkan ${issue2.origin} memiliki ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Terlalu kecil: diharapkan ${issue2.origin} menjadi ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `String tidak valid: harus menyertakan "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} tidak valid`;
      }
      case "not_multiple_of":
        return `Angka tidak valid: harus kelipatan dari ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali ${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak valid di ${issue2.origin}`;
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return `Nilai tidak valid di ${issue2.origin}`;
      default:
        return `Input tidak valid`;
    }
  };
}, "error");
function id_default() {
  return {
    localeError: error21()
  };
}
__name(id_default, "default");

// node_modules/zod/v4/locales/is.js
init_esm();
var error22 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "stafi", verb: "að hafa" },
    file: { unit: "bæti", verb: "að hafa" },
    array: { unit: "hluti", verb: "að hafa" },
    set: { unit: "hluti", verb: "að hafa" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "gildi",
    email: "netfang",
    url: "vefslóð",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dagsetning og tími",
    date: "ISO dagsetning",
    time: "ISO tími",
    duration: "ISO tímalengd",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded strengur",
    base64url: "base64url-encoded strengur",
    json_string: "JSON strengur",
    e164: "E.164 tölugildi",
    jwt: "JWT",
    template_literal: "gildi"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "númer",
    array: "fylki"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera instanceof ${issue2.expected}`;
        }
        return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera ${expected}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Rangt gildi: gert ráð fyrir ${stringifyPrimitive(issue2.values[0])}`;
        return `Ógilt val: má vera eitt af eftirfarandi ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Of stórt: gert er ráð fyrir að ${issue2.origin ?? "gildi"} hafi ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "hluti"}`;
        return `Of stórt: gert er ráð fyrir að ${issue2.origin ?? "gildi"} sé ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Of lítið: gert er ráð fyrir að ${issue2.origin} hafi ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Of lítið: gert er ráð fyrir að ${issue2.origin} sé ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Ógildur strengur: verður að byrja á "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Ógildur strengur: verður að enda á "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ógildur strengur: verður að innihalda "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ógildur strengur: verður að fylgja mynstri ${_issue.pattern}`;
        return `Rangt ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Röng tala: verður að vera margfeldi af ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Óþekkt ${issue2.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Rangur lykill í ${issue2.origin}`;
      case "invalid_union":
        return "Rangt gildi";
      case "invalid_element":
        return `Rangt gildi í ${issue2.origin}`;
      default:
        return `Rangt gildi`;
    }
  };
}, "error");
function is_default() {
  return {
    localeError: error22()
  };
}
__name(is_default, "default");

// node_modules/zod/v4/locales/it.js
init_esm();
var error23 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "input",
    email: "indirizzo email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e ora ISO",
    date: "data ISO",
    time: "ora ISO",
    duration: "durata ISO",
    ipv4: "indirizzo IPv4",
    ipv6: "indirizzo IPv6",
    cidrv4: "intervallo IPv4",
    cidrv6: "intervallo IPv6",
    base64: "stringa codificata in base64",
    base64url: "URL codificata in base64",
    json_string: "stringa JSON",
    e164: "numero E.164",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "numero",
    array: "vettore"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Input non valido: atteso instanceof ${issue2.expected}, ricevuto ${received}`;
        }
        return `Input non valido: atteso ${expected}, ricevuto ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Input non valido: atteso ${stringifyPrimitive(issue2.values[0])}`;
        return `Opzione non valida: atteso uno tra ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Troppo grande: ${issue2.origin ?? "valore"} deve avere ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementi"}`;
        return `Troppo grande: ${issue2.origin ?? "valore"} deve essere ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Troppo piccolo: ${issue2.origin} deve avere ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Troppo piccolo: ${issue2.origin} deve essere ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Stringa non valida: deve includere "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
        return `Input non valido: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Numero non valido: deve essere un multiplo di ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Chiav${issue2.keys.length > 1 ? "i" : "e"} non riconosciut${issue2.keys.length > 1 ? "e" : "a"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Chiave non valida in ${issue2.origin}`;
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return `Valore non valido in ${issue2.origin}`;
      default:
        return `Input non valido`;
    }
  };
}, "error");
function it_default() {
  return {
    localeError: error23()
  };
}
__name(it_default, "default");

// node_modules/zod/v4/locales/ja.js
init_esm();
var error24 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "文字", verb: "である" },
    file: { unit: "バイト", verb: "である" },
    array: { unit: "要素", verb: "である" },
    set: { unit: "要素", verb: "である" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "入力値",
    email: "メールアドレス",
    url: "URL",
    emoji: "絵文字",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日時",
    date: "ISO日付",
    time: "ISO時刻",
    duration: "ISO期間",
    ipv4: "IPv4アドレス",
    ipv6: "IPv6アドレス",
    cidrv4: "IPv4範囲",
    cidrv6: "IPv6範囲",
    base64: "base64エンコード文字列",
    base64url: "base64urlエンコード文字列",
    json_string: "JSON文字列",
    e164: "E.164番号",
    jwt: "JWT",
    template_literal: "入力値"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "数値",
    array: "配列"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `無効な入力: instanceof ${issue2.expected}が期待されましたが、${received}が入力されました`;
        }
        return `無効な入力: ${expected}が期待されましたが、${received}が入力されました`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `無効な入力: ${stringifyPrimitive(issue2.values[0])}が期待されました`;
        return `無効な選択: ${joinValues(issue2.values, "、")}のいずれかである必要があります`;
      case "too_big": {
        const adj = issue2.inclusive ? "以下である" : "より小さい";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `大きすぎる値: ${issue2.origin ?? "値"}は${issue2.maximum.toString()}${sizing.unit ?? "要素"}${adj}必要があります`;
        return `大きすぎる値: ${issue2.origin ?? "値"}は${issue2.maximum.toString()}${adj}必要があります`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "以上である" : "より大きい";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `小さすぎる値: ${issue2.origin}は${issue2.minimum.toString()}${sizing.unit}${adj}必要があります`;
        return `小さすぎる値: ${issue2.origin}は${issue2.minimum.toString()}${adj}必要があります`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `無効な文字列: "${_issue.prefix}"で始まる必要があります`;
        if (_issue.format === "ends_with")
          return `無効な文字列: "${_issue.suffix}"で終わる必要があります`;
        if (_issue.format === "includes")
          return `無効な文字列: "${_issue.includes}"を含む必要があります`;
        if (_issue.format === "regex")
          return `無効な文字列: パターン${_issue.pattern}に一致する必要があります`;
        return `無効な${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `無効な数値: ${issue2.divisor}の倍数である必要があります`;
      case "unrecognized_keys":
        return `認識されていないキー${issue2.keys.length > 1 ? "群" : ""}: ${joinValues(issue2.keys, "、")}`;
      case "invalid_key":
        return `${issue2.origin}内の無効なキー`;
      case "invalid_union":
        return "無効な入力";
      case "invalid_element":
        return `${issue2.origin}内の無効な値`;
      default:
        return `無効な入力`;
    }
  };
}, "error");
function ja_default() {
  return {
    localeError: error24()
  };
}
__name(ja_default, "default");

// node_modules/zod/v4/locales/ka.js
init_esm();
var error25 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "სიმბოლო", verb: "უნდა შეიცავდეს" },
    file: { unit: "ბაიტი", verb: "უნდა შეიცავდეს" },
    array: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" },
    set: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "შეყვანა",
    email: "ელ-ფოსტის მისამართი",
    url: "URL",
    emoji: "ემოჯი",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "თარიღი-დრო",
    date: "თარიღი",
    time: "დრო",
    duration: "ხანგრძლივობა",
    ipv4: "IPv4 მისამართი",
    ipv6: "IPv6 მისამართი",
    cidrv4: "IPv4 დიაპაზონი",
    cidrv6: "IPv6 დიაპაზონი",
    base64: "base64-კოდირებული ველი",
    base64url: "base64url-კოდირებული ველი",
    json_string: "JSON ველი",
    e164: "E.164 ნომერი",
    jwt: "JWT",
    template_literal: "შეყვანა"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "რიცხვი",
    string: "ველი",
    boolean: "ბულეანი",
    function: "ფუნქცია",
    array: "მასივი"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `არასწორი შეყვანა: მოსალოდნელი instanceof ${issue2.expected}, მიღებული ${received}`;
        }
        return `არასწორი შეყვანა: მოსალოდნელი ${expected}, მიღებული ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `არასწორი შეყვანა: მოსალოდნელი ${stringifyPrimitive(issue2.values[0])}`;
        return `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${joinValues(issue2.values, "|")}-დან`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `ზედმეტად დიდი: მოსალოდნელი ${issue2.origin ?? "მნიშვნელობა"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
        return `ზედმეტად დიდი: მოსალოდნელი ${issue2.origin ?? "მნიშვნელობა"} იყოს ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `ზედმეტად პატარა: მოსალოდნელი ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `ზედმეტად პატარა: მოსალოდნელი ${issue2.origin} იყოს ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `არასწორი ველი: უნდა იწყებოდეს "${_issue.prefix}"-ით`;
        }
        if (_issue.format === "ends_with")
          return `არასწორი ველი: უნდა მთავრდებოდეს "${_issue.suffix}"-ით`;
        if (_issue.format === "includes")
          return `არასწორი ველი: უნდა შეიცავდეს "${_issue.includes}"-ს`;
        if (_issue.format === "regex")
          return `არასწორი ველი: უნდა შეესაბამებოდეს შაბლონს ${_issue.pattern}`;
        return `არასწორი ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `არასწორი რიცხვი: უნდა იყოს ${issue2.divisor}-ის ჯერადი`;
      case "unrecognized_keys":
        return `უცნობი გასაღებ${issue2.keys.length > 1 ? "ები" : "ი"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `არასწორი გასაღები ${issue2.origin}-ში`;
      case "invalid_union":
        return "არასწორი შეყვანა";
      case "invalid_element":
        return `არასწორი მნიშვნელობა ${issue2.origin}-ში`;
      default:
        return `არასწორი შეყვანა`;
    }
  };
}, "error");
function ka_default() {
  return {
    localeError: error25()
  };
}
__name(ka_default, "default");

// node_modules/zod/v4/locales/kh.js
init_esm();

// node_modules/zod/v4/locales/km.js
init_esm();
var error26 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "តួអក្សរ", verb: "គួរមាន" },
    file: { unit: "បៃ", verb: "គួរមាន" },
    array: { unit: "ធាតុ", verb: "គួរមាន" },
    set: { unit: "ធាតុ", verb: "គួរមាន" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "ទិន្នន័យបញ្ចូល",
    email: "អាសយដ្ឋានអ៊ីមែល",
    url: "URL",
    emoji: "សញ្ញាអារម្មណ៍",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
    date: "កាលបរិច្ឆេទ ISO",
    time: "ម៉ោង ISO",
    duration: "រយៈពេល ISO",
    ipv4: "អាសយដ្ឋាន IPv4",
    ipv6: "អាសយដ្ឋាន IPv6",
    cidrv4: "ដែនអាសយដ្ឋាន IPv4",
    cidrv6: "ដែនអាសយដ្ឋាន IPv6",
    base64: "ខ្សែអក្សរអ៊ិកូដ base64",
    base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
    json_string: "ខ្សែអក្សរ JSON",
    e164: "លេខ E.164",
    jwt: "JWT",
    template_literal: "ទិន្នន័យបញ្ចូល"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "លេខ",
    array: "អារេ (Array)",
    null: "គ្មានតម្លៃ (null)"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${issue2.expected} ប៉ុន្តែទទួលបាន ${received}`;
        }
        return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${expected} ប៉ុន្តែទទួលបាន ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${stringifyPrimitive(issue2.values[0])}`;
        return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `ធំពេក៖ ត្រូវការ ${issue2.origin ?? "តម្លៃ"} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "ធាតុ"}`;
        return `ធំពេក៖ ត្រូវការ ${issue2.origin ?? "តម្លៃ"} ${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `តូចពេក៖ ត្រូវការ ${issue2.origin} ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `តូចពេក៖ ត្រូវការ ${issue2.origin} ${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${_issue.pattern}`;
        return `មិនត្រឹមត្រូវ៖ ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${issue2.divisor}`;
      case "unrecognized_keys":
        return `រកឃើញសោមិនស្គាល់៖ ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `សោមិនត្រឹមត្រូវនៅក្នុង ${issue2.origin}`;
      case "invalid_union":
        return `ទិន្នន័យមិនត្រឹមត្រូវ`;
      case "invalid_element":
        return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${issue2.origin}`;
      default:
        return `ទិន្នន័យមិនត្រឹមត្រូវ`;
    }
  };
}, "error");
function km_default() {
  return {
    localeError: error26()
  };
}
__name(km_default, "default");

// node_modules/zod/v4/locales/kh.js
function kh_default() {
  return km_default();
}
__name(kh_default, "default");

// node_modules/zod/v4/locales/ko.js
init_esm();
var error27 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "문자", verb: "to have" },
    file: { unit: "바이트", verb: "to have" },
    array: { unit: "개", verb: "to have" },
    set: { unit: "개", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "입력",
    email: "이메일 주소",
    url: "URL",
    emoji: "이모지",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 날짜시간",
    date: "ISO 날짜",
    time: "ISO 시간",
    duration: "ISO 기간",
    ipv4: "IPv4 주소",
    ipv6: "IPv6 주소",
    cidrv4: "IPv4 범위",
    cidrv6: "IPv6 범위",
    base64: "base64 인코딩 문자열",
    base64url: "base64url 인코딩 문자열",
    json_string: "JSON 문자열",
    e164: "E.164 번호",
    jwt: "JWT",
    template_literal: "입력"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `잘못된 입력: 예상 타입은 instanceof ${issue2.expected}, 받은 타입은 ${received}입니다`;
        }
        return `잘못된 입력: 예상 타입은 ${expected}, 받은 타입은 ${received}입니다`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `잘못된 입력: 값은 ${stringifyPrimitive(issue2.values[0])} 이어야 합니다`;
        return `잘못된 옵션: ${joinValues(issue2.values, "또는 ")} 중 하나여야 합니다`;
      case "too_big": {
        const adj = issue2.inclusive ? "이하" : "미만";
        const suffix = adj === "미만" ? "이어야 합니다" : "여야 합니다";
        const sizing = getSizing(issue2.origin);
        const unit = sizing?.unit ?? "요소";
        if (sizing)
          return `${issue2.origin ?? "값"}이 너무 큽니다: ${issue2.maximum.toString()}${unit} ${adj}${suffix}`;
        return `${issue2.origin ?? "값"}이 너무 큽니다: ${issue2.maximum.toString()} ${adj}${suffix}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "이상" : "초과";
        const suffix = adj === "이상" ? "이어야 합니다" : "여야 합니다";
        const sizing = getSizing(issue2.origin);
        const unit = sizing?.unit ?? "요소";
        if (sizing) {
          return `${issue2.origin ?? "값"}이 너무 작습니다: ${issue2.minimum.toString()}${unit} ${adj}${suffix}`;
        }
        return `${issue2.origin ?? "값"}이 너무 작습니다: ${issue2.minimum.toString()} ${adj}${suffix}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `잘못된 문자열: "${_issue.prefix}"(으)로 시작해야 합니다`;
        }
        if (_issue.format === "ends_with")
          return `잘못된 문자열: "${_issue.suffix}"(으)로 끝나야 합니다`;
        if (_issue.format === "includes")
          return `잘못된 문자열: "${_issue.includes}"을(를) 포함해야 합니다`;
        if (_issue.format === "regex")
          return `잘못된 문자열: 정규식 ${_issue.pattern} 패턴과 일치해야 합니다`;
        return `잘못된 ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `잘못된 숫자: ${issue2.divisor}의 배수여야 합니다`;
      case "unrecognized_keys":
        return `인식할 수 없는 키: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `잘못된 키: ${issue2.origin}`;
      case "invalid_union":
        return `잘못된 입력`;
      case "invalid_element":
        return `잘못된 값: ${issue2.origin}`;
      default:
        return `잘못된 입력`;
    }
  };
}, "error");
function ko_default() {
  return {
    localeError: error27()
  };
}
__name(ko_default, "default");

// node_modules/zod/v4/locales/lt.js
init_esm();
var capitalizeFirstCharacter = /* @__PURE__ */ __name((text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
}, "capitalizeFirstCharacter");
function getUnitTypeFromNumber(number4) {
  const abs = Math.abs(number4);
  const last = abs % 10;
  const last2 = abs % 100;
  if (last2 >= 11 && last2 <= 19 || last === 0)
    return "many";
  if (last === 1)
    return "one";
  return "few";
}
__name(getUnitTypeFromNumber, "getUnitTypeFromNumber");
var error28 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: {
      unit: {
        one: "simbolis",
        few: "simboliai",
        many: "simbolių"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne ilgesnė kaip",
          notInclusive: "turi būti trumpesnė kaip"
        },
        bigger: {
          inclusive: "turi būti ne trumpesnė kaip",
          notInclusive: "turi būti ilgesnė kaip"
        }
      }
    },
    file: {
      unit: {
        one: "baitas",
        few: "baitai",
        many: "baitų"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne didesnis kaip",
          notInclusive: "turi būti mažesnis kaip"
        },
        bigger: {
          inclusive: "turi būti ne mažesnis kaip",
          notInclusive: "turi būti didesnis kaip"
        }
      }
    },
    array: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    },
    set: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    }
  };
  function getSizing(origin, unitType, inclusive, targetShouldBe) {
    const result = Sizable[origin] ?? null;
    if (result === null)
      return result;
    return {
      unit: result.unit[unitType],
      verb: result.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"]
    };
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "įvestis",
    email: "el. pašto adresas",
    url: "URL",
    emoji: "jaustukas",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO data ir laikas",
    date: "ISO data",
    time: "ISO laikas",
    duration: "ISO trukmė",
    ipv4: "IPv4 adresas",
    ipv6: "IPv6 adresas",
    cidrv4: "IPv4 tinklo prefiksas (CIDR)",
    cidrv6: "IPv6 tinklo prefiksas (CIDR)",
    base64: "base64 užkoduota eilutė",
    base64url: "base64url užkoduota eilutė",
    json_string: "JSON eilutė",
    e164: "E.164 numeris",
    jwt: "JWT",
    template_literal: "įvestis"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "skaičius",
    bigint: "sveikasis skaičius",
    string: "eilutė",
    boolean: "loginė reikšmė",
    undefined: "neapibrėžta reikšmė",
    function: "funkcija",
    symbol: "simbolis",
    array: "masyvas",
    object: "objektas",
    null: "nulinė reikšmė"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Gautas tipas ${received}, o tikėtasi - instanceof ${issue2.expected}`;
        }
        return `Gautas tipas ${received}, o tikėtasi - ${expected}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Privalo būti ${stringifyPrimitive(issue2.values[0])}`;
        return `Privalo būti vienas iš ${joinValues(issue2.values, "|")} pasirinkimų`;
      case "too_big": {
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        const sizing = getSizing(issue2.origin, getUnitTypeFromNumber(Number(issue2.maximum)), issue2.inclusive ?? false, "smaller");
        if (sizing?.verb)
          return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} ${sizing.verb} ${issue2.maximum.toString()} ${sizing.unit ?? "elementų"}`;
        const adj = issue2.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
        return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} turi būti ${adj} ${issue2.maximum.toString()} ${sizing?.unit}`;
      }
      case "too_small": {
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        const sizing = getSizing(issue2.origin, getUnitTypeFromNumber(Number(issue2.minimum)), issue2.inclusive ?? false, "bigger");
        if (sizing?.verb)
          return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} ${sizing.verb} ${issue2.minimum.toString()} ${sizing.unit ?? "elementų"}`;
        const adj = issue2.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
        return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} turi būti ${adj} ${issue2.minimum.toString()} ${sizing?.unit}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Eilutė privalo prasidėti "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Eilutė privalo pasibaigti "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Eilutė privalo įtraukti "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Eilutė privalo atitikti ${_issue.pattern}`;
        return `Neteisingas ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Skaičius privalo būti ${issue2.divisor} kartotinis.`;
      case "unrecognized_keys":
        return `Neatpažint${issue2.keys.length > 1 ? "i" : "as"} rakt${issue2.keys.length > 1 ? "ai" : "as"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga įvestis";
      case "invalid_element": {
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} turi klaidingą įvestį`;
      }
      default:
        return "Klaidinga įvestis";
    }
  };
}, "error");
function lt_default() {
  return {
    localeError: error28()
  };
}
__name(lt_default, "default");

// node_modules/zod/v4/locales/mk.js
init_esm();
var error29 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "знаци", verb: "да имаат" },
    file: { unit: "бајти", verb: "да имаат" },
    array: { unit: "ставки", verb: "да имаат" },
    set: { unit: "ставки", verb: "да имаат" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "внес",
    email: "адреса на е-пошта",
    url: "URL",
    emoji: "емоџи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO датум и време",
    date: "ISO датум",
    time: "ISO време",
    duration: "ISO времетраење",
    ipv4: "IPv4 адреса",
    ipv6: "IPv6 адреса",
    cidrv4: "IPv4 опсег",
    cidrv6: "IPv6 опсег",
    base64: "base64-енкодирана низа",
    base64url: "base64url-енкодирана низа",
    json_string: "JSON низа",
    e164: "E.164 број",
    jwt: "JWT",
    template_literal: "внес"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "број",
    array: "низа"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Грешен внес: се очекува instanceof ${issue2.expected}, примено ${received}`;
        }
        return `Грешен внес: се очекува ${expected}, примено ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
        return `Грешана опција: се очекува една ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Премногу голем: се очекува ${issue2.origin ?? "вредноста"} да има ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "елементи"}`;
        return `Премногу голем: се очекува ${issue2.origin ?? "вредноста"} да биде ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Премногу мал: се очекува ${issue2.origin} да има ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Премногу мал: се очекува ${issue2.origin} да биде ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Неважечка низа: мора да започнува со "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Неважечка низа: мора да завршува со "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Неважечка низа: мора да вклучува "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Неважечка низа: мора да одгоара на патернот ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Грешен број: мора да биде делив со ${issue2.divisor}`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Грешен клуч во ${issue2.origin}`;
      case "invalid_union":
        return "Грешен внес";
      case "invalid_element":
        return `Грешна вредност во ${issue2.origin}`;
      default:
        return `Грешен внес`;
    }
  };
}, "error");
function mk_default() {
  return {
    localeError: error29()
  };
}
__name(mk_default, "default");

// node_modules/zod/v4/locales/ms.js
init_esm();
var error30 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "input",
    email: "alamat e-mel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tarikh masa ISO",
    date: "tarikh ISO",
    time: "masa ISO",
    duration: "tempoh ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "julat IPv4",
    cidrv6: "julat IPv6",
    base64: "string dikodkan base64",
    base64url: "string dikodkan base64url",
    json_string: "string JSON",
    e164: "nombor E.164",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nombor"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Input tidak sah: dijangka instanceof ${issue2.expected}, diterima ${received}`;
        }
        return `Input tidak sah: dijangka ${expected}, diterima ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Input tidak sah: dijangka ${stringifyPrimitive(issue2.values[0])}`;
        return `Pilihan tidak sah: dijangka salah satu daripada ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Terlalu besar: dijangka ${issue2.origin ?? "nilai"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemen"}`;
        return `Terlalu besar: dijangka ${issue2.origin ?? "nilai"} adalah ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Terlalu kecil: dijangka ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Terlalu kecil: dijangka ${issue2.origin} adalah ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} tidak sah`;
      }
      case "not_multiple_of":
        return `Nombor tidak sah: perlu gandaan ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak sah dalam ${issue2.origin}`;
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return `Nilai tidak sah dalam ${issue2.origin}`;
      default:
        return `Input tidak sah`;
    }
  };
}, "error");
function ms_default() {
  return {
    localeError: error30()
  };
}
__name(ms_default, "default");

// node_modules/zod/v4/locales/nl.js
init_esm();
var error31 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "invoer",
    email: "emailadres",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum en tijd",
    date: "ISO datum",
    time: "ISO tijd",
    duration: "ISO duur",
    ipv4: "IPv4-adres",
    ipv6: "IPv6-adres",
    cidrv4: "IPv4-bereik",
    cidrv6: "IPv6-bereik",
    base64: "base64-gecodeerde tekst",
    base64url: "base64 URL-gecodeerde tekst",
    json_string: "JSON string",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "invoer"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "getal"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ongeldige invoer: verwacht instanceof ${issue2.expected}, ontving ${received}`;
        }
        return `Ongeldige invoer: verwacht ${expected}, ontving ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ongeldige invoer: verwacht ${stringifyPrimitive(issue2.values[0])}`;
        return `Ongeldige optie: verwacht één van ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        const longName = issue2.origin === "date" ? "laat" : issue2.origin === "string" ? "lang" : "groot";
        if (sizing)
          return `Te ${longName}: verwacht dat ${issue2.origin ?? "waarde"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementen"} ${sizing.verb}`;
        return `Te ${longName}: verwacht dat ${issue2.origin ?? "waarde"} ${adj}${issue2.maximum.toString()} is`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        const shortName = issue2.origin === "date" ? "vroeg" : issue2.origin === "string" ? "kort" : "klein";
        if (sizing) {
          return `Te ${shortName}: verwacht dat ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
        }
        return `Te ${shortName}: verwacht dat ${issue2.origin} ${adj}${issue2.minimum.toString()} is`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
        }
        if (_issue.format === "ends_with")
          return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
        if (_issue.format === "includes")
          return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
        if (_issue.format === "regex")
          return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
        return `Ongeldig: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ongeldig getal: moet een veelvoud van ${issue2.divisor} zijn`;
      case "unrecognized_keys":
        return `Onbekende key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ongeldige key in ${issue2.origin}`;
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return `Ongeldige waarde in ${issue2.origin}`;
      default:
        return `Ongeldige invoer`;
    }
  };
}, "error");
function nl_default() {
  return {
    localeError: error31()
  };
}
__name(nl_default, "default");

// node_modules/zod/v4/locales/no.js
init_esm();
var error32 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "tegn", verb: "å ha" },
    file: { unit: "bytes", verb: "å ha" },
    array: { unit: "elementer", verb: "å inneholde" },
    set: { unit: "elementer", verb: "å inneholde" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "input",
    email: "e-postadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslett",
    date: "ISO-dato",
    time: "ISO-klokkeslett",
    duration: "ISO-varighet",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spekter",
    cidrv6: "IPv6-spekter",
    base64: "base64-enkodet streng",
    base64url: "base64url-enkodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "tall",
    array: "liste"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ugyldig input: forventet instanceof ${issue2.expected}, fikk ${received}`;
        }
        return `Ugyldig input: forventet ${expected}, fikk ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ugyldig verdi: forventet ${stringifyPrimitive(issue2.values[0])}`;
        return `Ugyldig valg: forventet en av ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `For stor(t): forventet ${issue2.origin ?? "value"} til å ha ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementer"}`;
        return `For stor(t): forventet ${issue2.origin ?? "value"} til å ha ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `For lite(n): forventet ${issue2.origin} til å ha ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `For lite(n): forventet ${issue2.origin} til å ha ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Ugyldig streng: må starte med "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Ugyldig streng: må ende med "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ugyldig streng: må inneholde "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
        return `Ugyldig ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ugyldig tall: må være et multiplum av ${issue2.divisor}`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøkkel i ${issue2.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${issue2.origin}`;
      default:
        return `Ugyldig input`;
    }
  };
}, "error");
function no_default() {
  return {
    localeError: error32()
  };
}
__name(no_default, "default");

// node_modules/zod/v4/locales/ota.js
init_esm();
var error33 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "harf", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "unsur", verb: "olmalıdır" },
    set: { unit: "unsur", verb: "olmalıdır" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "giren",
    email: "epostagâh",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO hengâmı",
    date: "ISO tarihi",
    time: "ISO zamanı",
    duration: "ISO müddeti",
    ipv4: "IPv4 nişânı",
    ipv6: "IPv6 nişânı",
    cidrv4: "IPv4 menzili",
    cidrv6: "IPv6 menzili",
    base64: "base64-şifreli metin",
    base64url: "base64url-şifreli metin",
    json_string: "JSON metin",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "giren"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "numara",
    array: "saf",
    null: "gayb"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Fâsit giren: umulan instanceof ${issue2.expected}, alınan ${received}`;
        }
        return `Fâsit giren: umulan ${expected}, alınan ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Fâsit giren: umulan ${stringifyPrimitive(issue2.values[0])}`;
        return `Fâsit tercih: mûteberler ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Fazla büyük: ${issue2.origin ?? "value"}, ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmalıydı.`;
        return `Fazla büyük: ${issue2.origin ?? "value"}, ${adj}${issue2.maximum.toString()} olmalıydı.`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Fazla küçük: ${issue2.origin}, ${adj}${issue2.minimum.toString()} ${sizing.unit} sahip olmalıydı.`;
        }
        return `Fazla küçük: ${issue2.origin}, ${adj}${issue2.minimum.toString()} olmalıydı.`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Fâsit metin: "${_issue.prefix}" ile başlamalı.`;
        if (_issue.format === "ends_with")
          return `Fâsit metin: "${_issue.suffix}" ile bitmeli.`;
        if (_issue.format === "includes")
          return `Fâsit metin: "${_issue.includes}" ihtivâ etmeli.`;
        if (_issue.format === "regex")
          return `Fâsit metin: ${_issue.pattern} nakşına uymalı.`;
        return `Fâsit ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Fâsit sayı: ${issue2.divisor} katı olmalıydı.`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar ${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} için tanınmayan anahtar var.`;
      case "invalid_union":
        return "Giren tanınamadı.";
      case "invalid_element":
        return `${issue2.origin} için tanınmayan kıymet var.`;
      default:
        return `Kıymet tanınamadı.`;
    }
  };
}, "error");
function ota_default() {
  return {
    localeError: error33()
  };
}
__name(ota_default, "default");

// node_modules/zod/v4/locales/ps.js
init_esm();
var error34 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "توکي", verb: "ولري" },
    file: { unit: "بایټس", verb: "ولري" },
    array: { unit: "توکي", verb: "ولري" },
    set: { unit: "توکي", verb: "ولري" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "ورودي",
    email: "بریښنالیک",
    url: "یو آر ال",
    emoji: "ایموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "نیټه او وخت",
    date: "نېټه",
    time: "وخت",
    duration: "موده",
    ipv4: "د IPv4 پته",
    ipv6: "د IPv6 پته",
    cidrv4: "د IPv4 ساحه",
    cidrv6: "د IPv6 ساحه",
    base64: "base64-encoded متن",
    base64url: "base64url-encoded متن",
    json_string: "JSON متن",
    e164: "د E.164 شمېره",
    jwt: "JWT",
    template_literal: "ورودي"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "عدد",
    array: "ارې"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `ناسم ورودي: باید instanceof ${issue2.expected} وای, مګر ${received} ترلاسه شو`;
        }
        return `ناسم ورودي: باید ${expected} وای, مګر ${received} ترلاسه شو`;
      }
      case "invalid_value":
        if (issue2.values.length === 1) {
          return `ناسم ورودي: باید ${stringifyPrimitive(issue2.values[0])} وای`;
        }
        return `ناسم انتخاب: باید یو له ${joinValues(issue2.values, "|")} څخه وای`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `ډیر لوی: ${issue2.origin ?? "ارزښت"} باید ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "عنصرونه"} ولري`;
        }
        return `ډیر لوی: ${issue2.origin ?? "ارزښت"} باید ${adj}${issue2.maximum.toString()} وي`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `ډیر کوچنی: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} ${sizing.unit} ولري`;
        }
        return `ډیر کوچنی: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} وي`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `ناسم متن: باید د "${_issue.prefix}" سره پیل شي`;
        }
        if (_issue.format === "ends_with") {
          return `ناسم متن: باید د "${_issue.suffix}" سره پای ته ورسيږي`;
        }
        if (_issue.format === "includes") {
          return `ناسم متن: باید "${_issue.includes}" ولري`;
        }
        if (_issue.format === "regex") {
          return `ناسم متن: باید د ${_issue.pattern} سره مطابقت ولري`;
        }
        return `${FormatDictionary[_issue.format] ?? issue2.format} ناسم دی`;
      }
      case "not_multiple_of":
        return `ناسم عدد: باید د ${issue2.divisor} مضرب وي`;
      case "unrecognized_keys":
        return `ناسم ${issue2.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `ناسم کلیډ په ${issue2.origin} کې`;
      case "invalid_union":
        return `ناسمه ورودي`;
      case "invalid_element":
        return `ناسم عنصر په ${issue2.origin} کې`;
      default:
        return `ناسمه ورودي`;
    }
  };
}, "error");
function ps_default() {
  return {
    localeError: error34()
  };
}
__name(ps_default, "default");

// node_modules/zod/v4/locales/pl.js
init_esm();
var error35 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "znaków", verb: "mieć" },
    file: { unit: "bajtów", verb: "mieć" },
    array: { unit: "elementów", verb: "mieć" },
    set: { unit: "elementów", verb: "mieć" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "wyrażenie",
    email: "adres email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i godzina w formacie ISO",
    date: "data w formacie ISO",
    time: "godzina w formacie ISO",
    duration: "czas trwania ISO",
    ipv4: "adres IPv4",
    ipv6: "adres IPv6",
    cidrv4: "zakres IPv4",
    cidrv6: "zakres IPv6",
    base64: "ciąg znaków zakodowany w formacie base64",
    base64url: "ciąg znaków zakodowany w formacie base64url",
    json_string: "ciąg znaków w formacie JSON",
    e164: "liczba E.164",
    jwt: "JWT",
    template_literal: "wejście"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "liczba",
    array: "tablica"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${issue2.expected}, otrzymano ${received}`;
        }
        return `Nieprawidłowe dane wejściowe: oczekiwano ${expected}, otrzymano ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Nieprawidłowe dane wejściowe: oczekiwano ${stringifyPrimitive(issue2.values[0])}`;
        return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Za duża wartość: oczekiwano, że ${issue2.origin ?? "wartość"} będzie mieć ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementów"}`;
        }
        return `Zbyt duż(y/a/e): oczekiwano, że ${issue2.origin ?? "wartość"} będzie wynosić ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Za mała wartość: oczekiwano, że ${issue2.origin ?? "wartość"} będzie mieć ${adj}${issue2.minimum.toString()} ${sizing.unit ?? "elementów"}`;
        }
        return `Zbyt mał(y/a/e): oczekiwano, że ${issue2.origin ?? "wartość"} będzie wynosić ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Nieprawidłowy ciąg znaków: musi zawierać "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_issue.pattern}`;
        return `Nieprawidłow(y/a/e) ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Nieprawidłowa liczba: musi być wielokrotnością ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Nierozpoznane klucze${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Nieprawidłowy klucz w ${issue2.origin}`;
      case "invalid_union":
        return "Nieprawidłowe dane wejściowe";
      case "invalid_element":
        return `Nieprawidłowa wartość w ${issue2.origin}`;
      default:
        return `Nieprawidłowe dane wejściowe`;
    }
  };
}, "error");
function pl_default() {
  return {
    localeError: error35()
  };
}
__name(pl_default, "default");

// node_modules/zod/v4/locales/pt.js
init_esm();
var error36 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "caracteres", verb: "ter" },
    file: { unit: "bytes", verb: "ter" },
    array: { unit: "itens", verb: "ter" },
    set: { unit: "itens", verb: "ter" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "padrão",
    email: "endereço de e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "duração ISO",
    ipv4: "endereço IPv4",
    ipv6: "endereço IPv6",
    cidrv4: "faixa de IPv4",
    cidrv6: "faixa de IPv6",
    base64: "texto codificado em base64",
    base64url: "URL codificada em base64",
    json_string: "texto JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "número",
    null: "nulo"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Tipo inválido: esperado instanceof ${issue2.expected}, recebido ${received}`;
        }
        return `Tipo inválido: esperado ${expected}, recebido ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Entrada inválida: esperado ${stringifyPrimitive(issue2.values[0])}`;
        return `Opção inválida: esperada uma das ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Muito grande: esperado que ${issue2.origin ?? "valor"} tivesse ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementos"}`;
        return `Muito grande: esperado que ${issue2.origin ?? "valor"} fosse ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Muito pequeno: esperado que ${issue2.origin} tivesse ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Muito pequeno: esperado que ${issue2.origin} fosse ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Texto inválido: deve começar com "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Texto inválido: deve terminar com "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Texto inválido: deve incluir "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} inválido`;
      }
      case "not_multiple_of":
        return `Número inválido: deve ser múltiplo de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Chave${issue2.keys.length > 1 ? "s" : ""} desconhecida${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Chave inválida em ${issue2.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido em ${issue2.origin}`;
      default:
        return `Campo inválido`;
    }
  };
}, "error");
function pt_default() {
  return {
    localeError: error36()
  };
}
__name(pt_default, "default");

// node_modules/zod/v4/locales/ro.js
init_esm();
var error37 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "caractere", verb: "să aibă" },
    file: { unit: "octeți", verb: "să aibă" },
    array: { unit: "elemente", verb: "să aibă" },
    set: { unit: "elemente", verb: "să aibă" },
    map: { unit: "intrări", verb: "să aibă" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "intrare",
    email: "adresă de email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "dată și oră ISO",
    date: "dată ISO",
    time: "oră ISO",
    duration: "durată ISO",
    ipv4: "adresă IPv4",
    ipv6: "adresă IPv6",
    mac: "adresă MAC",
    cidrv4: "interval IPv4",
    cidrv6: "interval IPv6",
    base64: "șir codat base64",
    base64url: "șir codat base64url",
    json_string: "șir JSON",
    e164: "număr E.164",
    jwt: "JWT",
    template_literal: "intrare"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "șir",
    number: "număr",
    boolean: "boolean",
    function: "funcție",
    array: "matrice",
    object: "obiect",
    undefined: "nedefinit",
    symbol: "simbol",
    bigint: "număr mare",
    void: "void",
    never: "never",
    map: "hartă",
    set: "set"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return `Intrare invalidă: așteptat ${expected}, primit ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Intrare invalidă: așteptat ${stringifyPrimitive(issue2.values[0])}`;
        return `Opțiune invalidă: așteptat una dintre ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Prea mare: așteptat ca ${issue2.origin ?? "valoarea"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemente"}`;
        return `Prea mare: așteptat ca ${issue2.origin ?? "valoarea"} să fie ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Prea mic: așteptat ca ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Prea mic: așteptat ca ${issue2.origin} să fie ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Șir invalid: trebuie să înceapă cu "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Șir invalid: trebuie să se termine cu "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Șir invalid: trebuie să includă "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Șir invalid: trebuie să se potrivească cu modelul ${_issue.pattern}`;
        return `Format invalid: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Număr invalid: trebuie să fie multiplu de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Chei nerecunoscute: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Cheie invalidă în ${issue2.origin}`;
      case "invalid_union":
        return "Intrare invalidă";
      case "invalid_element":
        return `Valoare invalidă în ${issue2.origin}`;
      default:
        return `Intrare invalidă`;
    }
  };
}, "error");
function ro_default() {
  return {
    localeError: error37()
  };
}
__name(ro_default, "default");

// node_modules/zod/v4/locales/ru.js
init_esm();
function getRussianPlural(count, one, few, many) {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return many;
  }
  if (lastDigit === 1) {
    return one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }
  return many;
}
__name(getRussianPlural, "getRussianPlural");
var error38 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: {
      unit: {
        one: "символ",
        few: "символа",
        many: "символов"
      },
      verb: "иметь"
    },
    file: {
      unit: {
        one: "байт",
        few: "байта",
        many: "байт"
      },
      verb: "иметь"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "ввод",
    email: "email адрес",
    url: "URL",
    emoji: "эмодзи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата и время",
    date: "ISO дата",
    time: "ISO время",
    duration: "ISO длительность",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "строка в формате base64",
    base64url: "строка в формате base64url",
    json_string: "JSON строка",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "ввод"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "число",
    array: "массив"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Неверный ввод: ожидалось instanceof ${issue2.expected}, получено ${received}`;
        }
        return `Неверный ввод: ожидалось ${expected}, получено ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Неверный ввод: ожидалось ${stringifyPrimitive(issue2.values[0])}`;
        return `Неверный вариант: ожидалось одно из ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const maxValue = Number(issue2.maximum);
          const unit = getRussianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Слишком большое значение: ожидалось, что ${issue2.origin ?? "значение"} будет иметь ${adj}${issue2.maximum.toString()} ${unit}`;
        }
        return `Слишком большое значение: ожидалось, что ${issue2.origin ?? "значение"} будет ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const minValue = Number(issue2.minimum);
          const unit = getRussianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Слишком маленькое значение: ожидалось, что ${issue2.origin} будет иметь ${adj}${issue2.minimum.toString()} ${unit}`;
        }
        return `Слишком маленькое значение: ожидалось, что ${issue2.origin} будет ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Неверная строка: должна начинаться с "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Неверная строка: должна заканчиваться на "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Неверная строка: должна содержать "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Неверная строка: должна соответствовать шаблону ${_issue.pattern}`;
        return `Неверный ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Неверное число: должно быть кратным ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Нераспознанн${issue2.keys.length > 1 ? "ые" : "ый"} ключ${issue2.keys.length > 1 ? "и" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Неверный ключ в ${issue2.origin}`;
      case "invalid_union":
        return "Неверные входные данные";
      case "invalid_element":
        return `Неверное значение в ${issue2.origin}`;
      default:
        return `Неверные входные данные`;
    }
  };
}, "error");
function ru_default() {
  return {
    localeError: error38()
  };
}
__name(ru_default, "default");

// node_modules/zod/v4/locales/sl.js
init_esm();
var error39 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "vnos",
    email: "e-poštni naslov",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum in čas",
    date: "ISO datum",
    time: "ISO čas",
    duration: "ISO trajanje",
    ipv4: "IPv4 naslov",
    ipv6: "IPv6 naslov",
    cidrv4: "obseg IPv4",
    cidrv6: "obseg IPv6",
    base64: "base64 kodiran niz",
    base64url: "base64url kodiran niz",
    json_string: "JSON niz",
    e164: "E.164 številka",
    jwt: "JWT",
    template_literal: "vnos"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "število",
    array: "tabela"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Neveljaven vnos: pričakovano instanceof ${issue2.expected}, prejeto ${received}`;
        }
        return `Neveljaven vnos: pričakovano ${expected}, prejeto ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Neveljaven vnos: pričakovano ${stringifyPrimitive(issue2.values[0])}`;
        return `Neveljavna možnost: pričakovano eno izmed ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Preveliko: pričakovano, da bo ${issue2.origin ?? "vrednost"} imelo ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementov"}`;
        return `Preveliko: pričakovano, da bo ${issue2.origin ?? "vrednost"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Premajhno: pričakovano, da bo ${issue2.origin} imelo ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Premajhno: pričakovano, da bo ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Neveljaven niz: mora se začeti z "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Neveljaven niz: mora se končati z "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
        return `Neveljaven ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Neveljavno število: mora biti večkratnik ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznan${issue2.keys.length > 1 ? "i ključi" : " ključ"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Neveljaven ključ v ${issue2.origin}`;
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return `Neveljavna vrednost v ${issue2.origin}`;
      default:
        return "Neveljaven vnos";
    }
  };
}, "error");
function sl_default() {
  return {
    localeError: error39()
  };
}
__name(sl_default, "default");

// node_modules/zod/v4/locales/sv.js
init_esm();
var error40 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att innehålla" },
    set: { unit: "objekt", verb: "att innehålla" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "reguljärt uttryck",
    email: "e-postadress",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datum och tid",
    date: "ISO-datum",
    time: "ISO-tid",
    duration: "ISO-varaktighet",
    ipv4: "IPv4-intervall",
    ipv6: "IPv6-intervall",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodad sträng",
    base64url: "base64url-kodad sträng",
    json_string: "JSON-sträng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "mall-literal"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "antal",
    array: "lista"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ogiltig inmatning: förväntat instanceof ${issue2.expected}, fick ${received}`;
        }
        return `Ogiltig inmatning: förväntat ${expected}, fick ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ogiltig inmatning: förväntat ${stringifyPrimitive(issue2.values[0])}`;
        return `Ogiltigt val: förväntade en av ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `För stor(t): förväntade ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "element"}`;
        }
        return `För stor(t): förväntat ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `För lite(t): förväntade ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `För lite(t): förväntade ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Ogiltig sträng: måste börja med "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Ogiltig sträng: måste sluta med "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ogiltig sträng: måste innehålla "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ogiltig sträng: måste matcha mönstret "${_issue.pattern}"`;
        return `Ogiltig(t) ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ogiltigt tal: måste vara en multipel av ${issue2.divisor}`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ogiltig nyckel i ${issue2.origin ?? "värdet"}`;
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return `Ogiltigt värde i ${issue2.origin ?? "värdet"}`;
      default:
        return `Ogiltig input`;
    }
  };
}, "error");
function sv_default() {
  return {
    localeError: error40()
  };
}
__name(sv_default, "default");

// node_modules/zod/v4/locales/ta.js
init_esm();
var error41 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "எழுத்துக்கள்", verb: "கொண்டிருக்க வேண்டும்" },
    file: { unit: "பைட்டுகள்", verb: "கொண்டிருக்க வேண்டும்" },
    array: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
    set: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "உள்ளீடு",
    email: "மின்னஞ்சல் முகவரி",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO தேதி நேரம்",
    date: "ISO தேதி",
    time: "ISO நேரம்",
    duration: "ISO கால அளவு",
    ipv4: "IPv4 முகவரி",
    ipv6: "IPv6 முகவரி",
    cidrv4: "IPv4 வரம்பு",
    cidrv6: "IPv6 வரம்பு",
    base64: "base64-encoded சரம்",
    base64url: "base64url-encoded சரம்",
    json_string: "JSON சரம்",
    e164: "E.164 எண்",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "எண்",
    array: "அணி",
    null: "வெறுமை"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${issue2.expected}, பெறப்பட்டது ${received}`;
        }
        return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${expected}, பெறப்பட்டது ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${stringifyPrimitive(issue2.values[0])}`;
        return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${joinValues(issue2.values, "|")} இல் ஒன்று`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue2.origin ?? "மதிப்பு"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
        }
        return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue2.origin ?? "மதிப்பு"} ${adj}${issue2.maximum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} ஆக இருக்க வேண்டும்`;
        }
        return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue2.origin} ${adj}${issue2.minimum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `தவறான சரம்: "${_issue.prefix}" இல் தொடங்க வேண்டும்`;
        if (_issue.format === "ends_with")
          return `தவறான சரம்: "${_issue.suffix}" இல் முடிவடைய வேண்டும்`;
        if (_issue.format === "includes")
          return `தவறான சரம்: "${_issue.includes}" ஐ உள்ளடக்க வேண்டும்`;
        if (_issue.format === "regex")
          return `தவறான சரம்: ${_issue.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
        return `தவறான ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `தவறான எண்: ${issue2.divisor} இன் பலமாக இருக்க வேண்டும்`;
      case "unrecognized_keys":
        return `அடையாளம் தெரியாத விசை${issue2.keys.length > 1 ? "கள்" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} இல் தவறான விசை`;
      case "invalid_union":
        return "தவறான உள்ளீடு";
      case "invalid_element":
        return `${issue2.origin} இல் தவறான மதிப்பு`;
      default:
        return `தவறான உள்ளீடு`;
    }
  };
}, "error");
function ta_default() {
  return {
    localeError: error41()
  };
}
__name(ta_default, "default");

// node_modules/zod/v4/locales/th.js
init_esm();
var error42 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "ตัวอักษร", verb: "ควรมี" },
    file: { unit: "ไบต์", verb: "ควรมี" },
    array: { unit: "รายการ", verb: "ควรมี" },
    set: { unit: "รายการ", verb: "ควรมี" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "ข้อมูลที่ป้อน",
    email: "ที่อยู่อีเมล",
    url: "URL",
    emoji: "อิโมจิ",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "วันที่เวลาแบบ ISO",
    date: "วันที่แบบ ISO",
    time: "เวลาแบบ ISO",
    duration: "ช่วงเวลาแบบ ISO",
    ipv4: "ที่อยู่ IPv4",
    ipv6: "ที่อยู่ IPv6",
    cidrv4: "ช่วง IP แบบ IPv4",
    cidrv6: "ช่วง IP แบบ IPv6",
    base64: "ข้อความแบบ Base64",
    base64url: "ข้อความแบบ Base64 สำหรับ URL",
    json_string: "ข้อความแบบ JSON",
    e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
    jwt: "โทเคน JWT",
    template_literal: "ข้อมูลที่ป้อน"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "ตัวเลข",
    array: "อาร์เรย์ (Array)",
    null: "ไม่มีค่า (null)"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${issue2.expected} แต่ได้รับ ${received}`;
        }
        return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${expected} แต่ได้รับ ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `ค่าไม่ถูกต้อง: ควรเป็น ${stringifyPrimitive(issue2.values[0])}`;
        return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "ไม่เกิน" : "น้อยกว่า";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `เกินกำหนด: ${issue2.origin ?? "ค่า"} ควรมี${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "รายการ"}`;
        return `เกินกำหนด: ${issue2.origin ?? "ค่า"} ควรมี${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "อย่างน้อย" : "มากกว่า";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `น้อยกว่ากำหนด: ${issue2.origin} ควรมี${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `น้อยกว่ากำหนด: ${issue2.origin} ควรมี${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_issue.includes}" อยู่ในข้อความ`;
        if (_issue.format === "regex")
          return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_issue.pattern}`;
        return `รูปแบบไม่ถูกต้อง: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${issue2.divisor} ได้ลงตัว`;
      case "unrecognized_keys":
        return `พบคีย์ที่ไม่รู้จัก: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `คีย์ไม่ถูกต้องใน ${issue2.origin}`;
      case "invalid_union":
        return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
      case "invalid_element":
        return `ข้อมูลไม่ถูกต้องใน ${issue2.origin}`;
      default:
        return `ข้อมูลไม่ถูกต้อง`;
    }
  };
}, "error");
function th_default() {
  return {
    localeError: error42()
  };
}
__name(th_default, "default");

// node_modules/zod/v4/locales/tr.js
init_esm();
var error43 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "karakter", verb: "olmalı" },
    file: { unit: "bayt", verb: "olmalı" },
    array: { unit: "öğe", verb: "olmalı" },
    set: { unit: "öğe", verb: "olmalı" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "girdi",
    email: "e-posta adresi",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO tarih ve saat",
    date: "ISO tarih",
    time: "ISO saat",
    duration: "ISO süre",
    ipv4: "IPv4 adresi",
    ipv6: "IPv6 adresi",
    cidrv4: "IPv4 aralığı",
    cidrv6: "IPv6 aralığı",
    base64: "base64 ile şifrelenmiş metin",
    base64url: "base64url ile şifrelenmiş metin",
    json_string: "JSON dizesi",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "Şablon dizesi"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Geçersiz değer: beklenen instanceof ${issue2.expected}, alınan ${received}`;
        }
        return `Geçersiz değer: beklenen ${expected}, alınan ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Geçersiz değer: beklenen ${stringifyPrimitive(issue2.values[0])}`;
        return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Çok büyük: beklenen ${issue2.origin ?? "değer"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "öğe"}`;
        return `Çok büyük: beklenen ${issue2.origin ?? "değer"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Çok küçük: beklenen ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        return `Çok küçük: beklenen ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Geçersiz metin: "${_issue.prefix}" ile başlamalı`;
        if (_issue.format === "ends_with")
          return `Geçersiz metin: "${_issue.suffix}" ile bitmeli`;
        if (_issue.format === "includes")
          return `Geçersiz metin: "${_issue.includes}" içermeli`;
        if (_issue.format === "regex")
          return `Geçersiz metin: ${_issue.pattern} desenine uymalı`;
        return `Geçersiz ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Geçersiz sayı: ${issue2.divisor} ile tam bölünebilmeli`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar${issue2.keys.length > 1 ? "lar" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} içinde geçersiz anahtar`;
      case "invalid_union":
        return "Geçersiz değer";
      case "invalid_element":
        return `${issue2.origin} içinde geçersiz değer`;
      default:
        return `Geçersiz değer`;
    }
  };
}, "error");
function tr_default() {
  return {
    localeError: error43()
  };
}
__name(tr_default, "default");

// node_modules/zod/v4/locales/ua.js
init_esm();

// node_modules/zod/v4/locales/uk.js
init_esm();
var error44 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "символів", verb: "матиме" },
    file: { unit: "байтів", verb: "матиме" },
    array: { unit: "елементів", verb: "матиме" },
    set: { unit: "елементів", verb: "матиме" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "вхідні дані",
    email: "адреса електронної пошти",
    url: "URL",
    emoji: "емодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "дата та час ISO",
    date: "дата ISO",
    time: "час ISO",
    duration: "тривалість ISO",
    ipv4: "адреса IPv4",
    ipv6: "адреса IPv6",
    cidrv4: "діапазон IPv4",
    cidrv6: "діапазон IPv6",
    base64: "рядок у кодуванні base64",
    base64url: "рядок у кодуванні base64url",
    json_string: "рядок JSON",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "вхідні дані"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Неправильні вхідні дані: очікується instanceof ${issue2.expected}, отримано ${received}`;
        }
        return `Неправильні вхідні дані: очікується ${expected}, отримано ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Неправильні вхідні дані: очікується ${stringifyPrimitive(issue2.values[0])}`;
        return `Неправильна опція: очікується одне з ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Занадто велике: очікується, що ${issue2.origin ?? "значення"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "елементів"}`;
        return `Занадто велике: очікується, що ${issue2.origin ?? "значення"} буде ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Занадто мале: очікується, що ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Занадто мале: очікується, що ${issue2.origin} буде ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Неправильний рядок: повинен починатися з "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Неправильний рядок: повинен закінчуватися на "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Неправильний рядок: повинен містити "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Неправильний рядок: повинен відповідати шаблону ${_issue.pattern}`;
        return `Неправильний ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Неправильне число: повинно бути кратним ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Нерозпізнаний ключ${issue2.keys.length > 1 ? "і" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Неправильний ключ у ${issue2.origin}`;
      case "invalid_union":
        return "Неправильні вхідні дані";
      case "invalid_element":
        return `Неправильне значення у ${issue2.origin}`;
      default:
        return `Неправильні вхідні дані`;
    }
  };
}, "error");
function uk_default() {
  return {
    localeError: error44()
  };
}
__name(uk_default, "default");

// node_modules/zod/v4/locales/ua.js
function ua_default() {
  return uk_default();
}
__name(ua_default, "default");

// node_modules/zod/v4/locales/ur.js
init_esm();
var error45 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "حروف", verb: "ہونا" },
    file: { unit: "بائٹس", verb: "ہونا" },
    array: { unit: "آئٹمز", verb: "ہونا" },
    set: { unit: "آئٹمز", verb: "ہونا" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "ان پٹ",
    email: "ای میل ایڈریس",
    url: "یو آر ایل",
    emoji: "ایموجی",
    uuid: "یو یو آئی ڈی",
    uuidv4: "یو یو آئی ڈی وی 4",
    uuidv6: "یو یو آئی ڈی وی 6",
    nanoid: "نینو آئی ڈی",
    guid: "جی یو آئی ڈی",
    cuid: "سی یو آئی ڈی",
    cuid2: "سی یو آئی ڈی 2",
    ulid: "یو ایل آئی ڈی",
    xid: "ایکس آئی ڈی",
    ksuid: "کے ایس یو آئی ڈی",
    datetime: "آئی ایس او ڈیٹ ٹائم",
    date: "آئی ایس او تاریخ",
    time: "آئی ایس او وقت",
    duration: "آئی ایس او مدت",
    ipv4: "آئی پی وی 4 ایڈریس",
    ipv6: "آئی پی وی 6 ایڈریس",
    cidrv4: "آئی پی وی 4 رینج",
    cidrv6: "آئی پی وی 6 رینج",
    base64: "بیس 64 ان کوڈڈ سٹرنگ",
    base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
    json_string: "جے ایس او این سٹرنگ",
    e164: "ای 164 نمبر",
    jwt: "جے ڈبلیو ٹی",
    template_literal: "ان پٹ"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "نمبر",
    array: "آرے",
    null: "نل"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `غلط ان پٹ: instanceof ${issue2.expected} متوقع تھا، ${received} موصول ہوا`;
        }
        return `غلط ان پٹ: ${expected} متوقع تھا، ${received} موصول ہوا`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `غلط ان پٹ: ${stringifyPrimitive(issue2.values[0])} متوقع تھا`;
        return `غلط آپشن: ${joinValues(issue2.values, "|")} میں سے ایک متوقع تھا`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `بہت بڑا: ${issue2.origin ?? "ویلیو"} کے ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "عناصر"} ہونے متوقع تھے`;
        return `بہت بڑا: ${issue2.origin ?? "ویلیو"} کا ${adj}${issue2.maximum.toString()} ہونا متوقع تھا`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `بہت چھوٹا: ${issue2.origin} کے ${adj}${issue2.minimum.toString()} ${sizing.unit} ہونے متوقع تھے`;
        }
        return `بہت چھوٹا: ${issue2.origin} کا ${adj}${issue2.minimum.toString()} ہونا متوقع تھا`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `غلط سٹرنگ: "${_issue.prefix}" سے شروع ہونا چاہیے`;
        }
        if (_issue.format === "ends_with")
          return `غلط سٹرنگ: "${_issue.suffix}" پر ختم ہونا چاہیے`;
        if (_issue.format === "includes")
          return `غلط سٹرنگ: "${_issue.includes}" شامل ہونا چاہیے`;
        if (_issue.format === "regex")
          return `غلط سٹرنگ: پیٹرن ${_issue.pattern} سے میچ ہونا چاہیے`;
        return `غلط ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `غلط نمبر: ${issue2.divisor} کا مضاعف ہونا چاہیے`;
      case "unrecognized_keys":
        return `غیر تسلیم شدہ کی${issue2.keys.length > 1 ? "ز" : ""}: ${joinValues(issue2.keys, "، ")}`;
      case "invalid_key":
        return `${issue2.origin} میں غلط کی`;
      case "invalid_union":
        return "غلط ان پٹ";
      case "invalid_element":
        return `${issue2.origin} میں غلط ویلیو`;
      default:
        return `غلط ان پٹ`;
    }
  };
}, "error");
function ur_default() {
  return {
    localeError: error45()
  };
}
__name(ur_default, "default");

// node_modules/zod/v4/locales/uz.js
init_esm();
var error46 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "belgi", verb: "bo‘lishi kerak" },
    file: { unit: "bayt", verb: "bo‘lishi kerak" },
    array: { unit: "element", verb: "bo‘lishi kerak" },
    set: { unit: "element", verb: "bo‘lishi kerak" },
    map: { unit: "yozuv", verb: "bo‘lishi kerak" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "kirish",
    email: "elektron pochta manzili",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO sana va vaqti",
    date: "ISO sana",
    time: "ISO vaqt",
    duration: "ISO davomiylik",
    ipv4: "IPv4 manzil",
    ipv6: "IPv6 manzil",
    mac: "MAC manzil",
    cidrv4: "IPv4 diapazon",
    cidrv6: "IPv6 diapazon",
    base64: "base64 kodlangan satr",
    base64url: "base64url kodlangan satr",
    json_string: "JSON satr",
    e164: "E.164 raqam",
    jwt: "JWT",
    template_literal: "kirish"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "raqam",
    array: "massiv"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Noto‘g‘ri kirish: kutilgan instanceof ${issue2.expected}, qabul qilingan ${received}`;
        }
        return `Noto‘g‘ri kirish: kutilgan ${expected}, qabul qilingan ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Noto‘g‘ri kirish: kutilgan ${stringifyPrimitive(issue2.values[0])}`;
        return `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Juda katta: kutilgan ${issue2.origin ?? "qiymat"} ${adj}${issue2.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
        return `Juda katta: kutilgan ${issue2.origin ?? "qiymat"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Juda kichik: kutilgan ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
        }
        return `Juda kichik: kutilgan ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Noto‘g‘ri satr: "${_issue.prefix}" bilan boshlanishi kerak`;
        if (_issue.format === "ends_with")
          return `Noto‘g‘ri satr: "${_issue.suffix}" bilan tugashi kerak`;
        if (_issue.format === "includes")
          return `Noto‘g‘ri satr: "${_issue.includes}" ni o‘z ichiga olishi kerak`;
        if (_issue.format === "regex")
          return `Noto‘g‘ri satr: ${_issue.pattern} shabloniga mos kelishi kerak`;
        return `Noto‘g‘ri ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Noto‘g‘ri raqam: ${issue2.divisor} ning karralisi bo‘lishi kerak`;
      case "unrecognized_keys":
        return `Noma’lum kalit${issue2.keys.length > 1 ? "lar" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} dagi kalit noto‘g‘ri`;
      case "invalid_union":
        return "Noto‘g‘ri kirish";
      case "invalid_element":
        return `${issue2.origin} da noto‘g‘ri qiymat`;
      default:
        return `Noto‘g‘ri kirish`;
    }
  };
}, "error");
function uz_default() {
  return {
    localeError: error46()
  };
}
__name(uz_default, "default");

// node_modules/zod/v4/locales/vi.js
init_esm();
var error47 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "ký tự", verb: "có" },
    file: { unit: "byte", verb: "có" },
    array: { unit: "phần tử", verb: "có" },
    set: { unit: "phần tử", verb: "có" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "đầu vào",
    email: "địa chỉ email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ngày giờ ISO",
    date: "ngày ISO",
    time: "giờ ISO",
    duration: "khoảng thời gian ISO",
    ipv4: "địa chỉ IPv4",
    ipv6: "địa chỉ IPv6",
    cidrv4: "dải IPv4",
    cidrv6: "dải IPv6",
    base64: "chuỗi mã hóa base64",
    base64url: "chuỗi mã hóa base64url",
    json_string: "chuỗi JSON",
    e164: "số E.164",
    jwt: "JWT",
    template_literal: "đầu vào"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "số",
    array: "mảng"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Đầu vào không hợp lệ: mong đợi instanceof ${issue2.expected}, nhận được ${received}`;
        }
        return `Đầu vào không hợp lệ: mong đợi ${expected}, nhận được ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Đầu vào không hợp lệ: mong đợi ${stringifyPrimitive(issue2.values[0])}`;
        return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Quá lớn: mong đợi ${issue2.origin ?? "giá trị"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "phần tử"}`;
        return `Quá lớn: mong đợi ${issue2.origin ?? "giá trị"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Quá nhỏ: mong đợi ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Quá nhỏ: mong đợi ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Chuỗi không hợp lệ: phải kết thúc bằng "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Chuỗi không hợp lệ: phải bao gồm "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Chuỗi không hợp lệ: phải khớp với mẫu ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} không hợp lệ`;
      }
      case "not_multiple_of":
        return `Số không hợp lệ: phải là bội số của ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Khóa không được nhận dạng: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Khóa không hợp lệ trong ${issue2.origin}`;
      case "invalid_union":
        return "Đầu vào không hợp lệ";
      case "invalid_element":
        return `Giá trị không hợp lệ trong ${issue2.origin}`;
      default:
        return `Đầu vào không hợp lệ`;
    }
  };
}, "error");
function vi_default() {
  return {
    localeError: error47()
  };
}
__name(vi_default, "default");

// node_modules/zod/v4/locales/zh-CN.js
init_esm();
var error48 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "字符", verb: "包含" },
    file: { unit: "字节", verb: "包含" },
    array: { unit: "项", verb: "包含" },
    set: { unit: "项", verb: "包含" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "输入",
    email: "电子邮件",
    url: "URL",
    emoji: "表情符号",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日期时间",
    date: "ISO日期",
    time: "ISO时间",
    duration: "ISO时长",
    ipv4: "IPv4地址",
    ipv6: "IPv6地址",
    cidrv4: "IPv4网段",
    cidrv6: "IPv6网段",
    base64: "base64编码字符串",
    base64url: "base64url编码字符串",
    json_string: "JSON字符串",
    e164: "E.164号码",
    jwt: "JWT",
    template_literal: "输入"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "数字",
    array: "数组",
    null: "空值(null)"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `无效输入：期望 instanceof ${issue2.expected}，实际接收 ${received}`;
        }
        return `无效输入：期望 ${expected}，实际接收 ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `无效输入：期望 ${stringifyPrimitive(issue2.values[0])}`;
        return `无效选项：期望以下之一 ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `数值过大：期望 ${issue2.origin ?? "值"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "个元素"}`;
        return `数值过大：期望 ${issue2.origin ?? "值"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `数值过小：期望 ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `数值过小：期望 ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `无效字符串：必须以 "${_issue.prefix}" 开头`;
        if (_issue.format === "ends_with")
          return `无效字符串：必须以 "${_issue.suffix}" 结尾`;
        if (_issue.format === "includes")
          return `无效字符串：必须包含 "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `无效字符串：必须满足正则表达式 ${_issue.pattern}`;
        return `无效${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `无效数字：必须是 ${issue2.divisor} 的倍数`;
      case "unrecognized_keys":
        return `出现未知的键(key): ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} 中的键(key)无效`;
      case "invalid_union":
        return "无效输入";
      case "invalid_element":
        return `${issue2.origin} 中包含无效值(value)`;
      default:
        return `无效输入`;
    }
  };
}, "error");
function zh_CN_default() {
  return {
    localeError: error48()
  };
}
__name(zh_CN_default, "default");

// node_modules/zod/v4/locales/zh-TW.js
init_esm();
var error49 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "字元", verb: "擁有" },
    file: { unit: "位元組", verb: "擁有" },
    array: { unit: "項目", verb: "擁有" },
    set: { unit: "項目", verb: "擁有" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "輸入",
    email: "郵件地址",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 日期時間",
    date: "ISO 日期",
    time: "ISO 時間",
    duration: "ISO 期間",
    ipv4: "IPv4 位址",
    ipv6: "IPv6 位址",
    cidrv4: "IPv4 範圍",
    cidrv6: "IPv6 範圍",
    base64: "base64 編碼字串",
    base64url: "base64url 編碼字串",
    json_string: "JSON 字串",
    e164: "E.164 數值",
    jwt: "JWT",
    template_literal: "輸入"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `無效的輸入值：預期為 instanceof ${issue2.expected}，但收到 ${received}`;
        }
        return `無效的輸入值：預期為 ${expected}，但收到 ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `無效的輸入值：預期為 ${stringifyPrimitive(issue2.values[0])}`;
        return `無效的選項：預期為以下其中之一 ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `數值過大：預期 ${issue2.origin ?? "值"} 應為 ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "個元素"}`;
        return `數值過大：預期 ${issue2.origin ?? "值"} 應為 ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `數值過小：預期 ${issue2.origin} 應為 ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `數值過小：預期 ${issue2.origin} 應為 ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `無效的字串：必須以 "${_issue.prefix}" 開頭`;
        }
        if (_issue.format === "ends_with")
          return `無效的字串：必須以 "${_issue.suffix}" 結尾`;
        if (_issue.format === "includes")
          return `無效的字串：必須包含 "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `無效的字串：必須符合格式 ${_issue.pattern}`;
        return `無效的 ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `無效的數字：必須為 ${issue2.divisor} 的倍數`;
      case "unrecognized_keys":
        return `無法識別的鍵值${issue2.keys.length > 1 ? "們" : ""}：${joinValues(issue2.keys, "、")}`;
      case "invalid_key":
        return `${issue2.origin} 中有無效的鍵值`;
      case "invalid_union":
        return "無效的輸入值";
      case "invalid_element":
        return `${issue2.origin} 中有無效的值`;
      default:
        return `無效的輸入值`;
    }
  };
}, "error");
function zh_TW_default() {
  return {
    localeError: error49()
  };
}
__name(zh_TW_default, "default");

// node_modules/zod/v4/locales/yo.js
init_esm();
var error50 = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "àmi", verb: "ní" },
    file: { unit: "bytes", verb: "ní" },
    array: { unit: "nkan", verb: "ní" },
    set: { unit: "nkan", verb: "ní" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "ẹ̀rọ ìbáwọlé",
    email: "àdírẹ́sì ìmẹ́lì",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "àkókò ISO",
    date: "ọjọ́ ISO",
    time: "àkókò ISO",
    duration: "àkókò tó pé ISO",
    ipv4: "àdírẹ́sì IPv4",
    ipv6: "àdírẹ́sì IPv6",
    cidrv4: "àgbègbè IPv4",
    cidrv6: "àgbègbè IPv6",
    base64: "ọ̀rọ̀ tí a kọ́ ní base64",
    base64url: "ọ̀rọ̀ base64url",
    json_string: "ọ̀rọ̀ JSON",
    e164: "nọ́mbà E.164",
    jwt: "JWT",
    template_literal: "ẹ̀rọ ìbáwọlé"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nọ́mbà",
    array: "akopọ"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${issue2.expected}, àmọ̀ a rí ${received}`;
        }
        return `Ìbáwọlé aṣìṣe: a ní láti fi ${expected}, àmọ̀ a rí ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ìbáwọlé aṣìṣe: a ní láti fi ${stringifyPrimitive(issue2.values[0])}`;
        return `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Tó pọ̀ jù: a ní láti jẹ́ pé ${issue2.origin ?? "iye"} ${sizing.verb} ${adj}${issue2.maximum} ${sizing.unit}`;
        return `Tó pọ̀ jù: a ní láti jẹ́ ${adj}${issue2.maximum}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Kéré ju: a ní láti jẹ́ pé ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum} ${sizing.unit}`;
        return `Kéré ju: a ní láti jẹ́ ${adj}${issue2.minimum}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${_issue.pattern}`;
        return `Aṣìṣe: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Bọtìnì àìmọ̀: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Bọtìnì aṣìṣe nínú ${issue2.origin}`;
      case "invalid_union":
        return "Ìbáwọlé aṣìṣe";
      case "invalid_element":
        return `Iye aṣìṣe nínú ${issue2.origin}`;
      default:
        return "Ìbáwọlé aṣìṣe";
    }
  };
}, "error");
function yo_default() {
  return {
    localeError: error50()
  };
}
__name(yo_default, "default");

// node_modules/zod/v4/core/registries.js
init_esm();
var _a2;
var $output = Symbol("ZodOutput");
var $input = Symbol("ZodInput");
var $ZodRegistry = class {
  static {
    __name(this, "$ZodRegistry");
  }
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
  }
  add(schema, ..._meta) {
    const meta3 = _meta[0];
    this._map.set(schema, meta3);
    if (meta3 && typeof meta3 === "object" && "id" in meta3) {
      this._idmap.set(meta3.id, schema);
    }
    return this;
  }
  clear() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
    return this;
  }
  remove(schema) {
    const meta3 = this._map.get(schema);
    if (meta3 && typeof meta3 === "object" && "id" in meta3) {
      this._idmap.delete(meta3.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
};
function registry() {
  return new $ZodRegistry();
}
__name(registry, "registry");
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;

// node_modules/zod/v4/core/api.js
init_esm();
// @__NO_SIDE_EFFECTS__
function _string(Class2, params) {
  return new Class2({
    type: "string",
    ...normalizeParams(params)
  });
}
__name(_string, "_string");
// @__NO_SIDE_EFFECTS__
function _coercedString(Class2, params) {
  return new Class2({
    type: "string",
    coerce: true,
    ...normalizeParams(params)
  });
}
__name(_coercedString, "_coercedString");
// @__NO_SIDE_EFFECTS__
function _email(Class2, params) {
  return new Class2({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_email, "_email");
// @__NO_SIDE_EFFECTS__
function _guid(Class2, params) {
  return new Class2({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_guid, "_guid");
// @__NO_SIDE_EFFECTS__
function _uuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_uuid, "_uuid");
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
__name(_uuidv4, "_uuidv4");
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
__name(_uuidv6, "_uuidv6");
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
__name(_uuidv7, "_uuidv7");
// @__NO_SIDE_EFFECTS__
function _url(Class2, params) {
  return new Class2({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_url, "_url");
// @__NO_SIDE_EFFECTS__
function _emoji2(Class2, params) {
  return new Class2({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_emoji2, "_emoji");
// @__NO_SIDE_EFFECTS__
function _nanoid(Class2, params) {
  return new Class2({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_nanoid, "_nanoid");
// @__NO_SIDE_EFFECTS__
function _cuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_cuid, "_cuid");
// @__NO_SIDE_EFFECTS__
function _cuid2(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_cuid2, "_cuid2");
// @__NO_SIDE_EFFECTS__
function _ulid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_ulid, "_ulid");
// @__NO_SIDE_EFFECTS__
function _xid(Class2, params) {
  return new Class2({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_xid, "_xid");
// @__NO_SIDE_EFFECTS__
function _ksuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_ksuid, "_ksuid");
// @__NO_SIDE_EFFECTS__
function _ipv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_ipv4, "_ipv4");
// @__NO_SIDE_EFFECTS__
function _ipv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_ipv6, "_ipv6");
// @__NO_SIDE_EFFECTS__
function _mac(Class2, params) {
  return new Class2({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_mac, "_mac");
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_cidrv4, "_cidrv4");
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_cidrv6, "_cidrv6");
// @__NO_SIDE_EFFECTS__
function _base64(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_base64, "_base64");
// @__NO_SIDE_EFFECTS__
function _base64url(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_base64url, "_base64url");
// @__NO_SIDE_EFFECTS__
function _e164(Class2, params) {
  return new Class2({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_e164, "_e164");
// @__NO_SIDE_EFFECTS__
function _jwt(Class2, params) {
  return new Class2({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_jwt, "_jwt");
var TimePrecision = {
  Any: null,
  Minute: -1,
  Second: 0,
  Millisecond: 3,
  Microsecond: 6
};
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
__name(_isoDateTime, "_isoDateTime");
// @__NO_SIDE_EFFECTS__
function _isoDate(Class2, params) {
  return new Class2({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
__name(_isoDate, "_isoDate");
// @__NO_SIDE_EFFECTS__
function _isoTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
__name(_isoTime, "_isoTime");
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class2, params) {
  return new Class2({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
__name(_isoDuration, "_isoDuration");
// @__NO_SIDE_EFFECTS__
function _number(Class2, params) {
  return new Class2({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
__name(_number, "_number");
// @__NO_SIDE_EFFECTS__
function _coercedNumber(Class2, params) {
  return new Class2({
    type: "number",
    coerce: true,
    checks: [],
    ...normalizeParams(params)
  });
}
__name(_coercedNumber, "_coercedNumber");
// @__NO_SIDE_EFFECTS__
function _int(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
__name(_int, "_int");
// @__NO_SIDE_EFFECTS__
function _float32(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "float32",
    ...normalizeParams(params)
  });
}
__name(_float32, "_float32");
// @__NO_SIDE_EFFECTS__
function _float64(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "float64",
    ...normalizeParams(params)
  });
}
__name(_float64, "_float64");
// @__NO_SIDE_EFFECTS__
function _int32(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "int32",
    ...normalizeParams(params)
  });
}
__name(_int32, "_int32");
// @__NO_SIDE_EFFECTS__
function _uint32(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "uint32",
    ...normalizeParams(params)
  });
}
__name(_uint32, "_uint32");
// @__NO_SIDE_EFFECTS__
function _boolean(Class2, params) {
  return new Class2({
    type: "boolean",
    ...normalizeParams(params)
  });
}
__name(_boolean, "_boolean");
// @__NO_SIDE_EFFECTS__
function _coercedBoolean(Class2, params) {
  return new Class2({
    type: "boolean",
    coerce: true,
    ...normalizeParams(params)
  });
}
__name(_coercedBoolean, "_coercedBoolean");
// @__NO_SIDE_EFFECTS__
function _bigint(Class2, params) {
  return new Class2({
    type: "bigint",
    ...normalizeParams(params)
  });
}
__name(_bigint, "_bigint");
// @__NO_SIDE_EFFECTS__
function _coercedBigint(Class2, params) {
  return new Class2({
    type: "bigint",
    coerce: true,
    ...normalizeParams(params)
  });
}
__name(_coercedBigint, "_coercedBigint");
// @__NO_SIDE_EFFECTS__
function _int64(Class2, params) {
  return new Class2({
    type: "bigint",
    check: "bigint_format",
    abort: false,
    format: "int64",
    ...normalizeParams(params)
  });
}
__name(_int64, "_int64");
// @__NO_SIDE_EFFECTS__
function _uint64(Class2, params) {
  return new Class2({
    type: "bigint",
    check: "bigint_format",
    abort: false,
    format: "uint64",
    ...normalizeParams(params)
  });
}
__name(_uint64, "_uint64");
// @__NO_SIDE_EFFECTS__
function _symbol(Class2, params) {
  return new Class2({
    type: "symbol",
    ...normalizeParams(params)
  });
}
__name(_symbol, "_symbol");
// @__NO_SIDE_EFFECTS__
function _undefined2(Class2, params) {
  return new Class2({
    type: "undefined",
    ...normalizeParams(params)
  });
}
__name(_undefined2, "_undefined");
// @__NO_SIDE_EFFECTS__
function _null2(Class2, params) {
  return new Class2({
    type: "null",
    ...normalizeParams(params)
  });
}
__name(_null2, "_null");
// @__NO_SIDE_EFFECTS__
function _any(Class2) {
  return new Class2({
    type: "any"
  });
}
__name(_any, "_any");
// @__NO_SIDE_EFFECTS__
function _unknown(Class2) {
  return new Class2({
    type: "unknown"
  });
}
__name(_unknown, "_unknown");
// @__NO_SIDE_EFFECTS__
function _never(Class2, params) {
  return new Class2({
    type: "never",
    ...normalizeParams(params)
  });
}
__name(_never, "_never");
// @__NO_SIDE_EFFECTS__
function _void(Class2, params) {
  return new Class2({
    type: "void",
    ...normalizeParams(params)
  });
}
__name(_void, "_void");
// @__NO_SIDE_EFFECTS__
function _date(Class2, params) {
  return new Class2({
    type: "date",
    ...normalizeParams(params)
  });
}
__name(_date, "_date");
// @__NO_SIDE_EFFECTS__
function _coercedDate(Class2, params) {
  return new Class2({
    type: "date",
    coerce: true,
    ...normalizeParams(params)
  });
}
__name(_coercedDate, "_coercedDate");
// @__NO_SIDE_EFFECTS__
function _nan(Class2, params) {
  return new Class2({
    type: "nan",
    ...normalizeParams(params)
  });
}
__name(_nan, "_nan");
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
__name(_lt, "_lt");
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
__name(_lte, "_lte");
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
__name(_gt, "_gt");
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
__name(_gte, "_gte");
// @__NO_SIDE_EFFECTS__
function _positive(params) {
  return /* @__PURE__ */ _gt(0, params);
}
__name(_positive, "_positive");
// @__NO_SIDE_EFFECTS__
function _negative(params) {
  return /* @__PURE__ */ _lt(0, params);
}
__name(_negative, "_negative");
// @__NO_SIDE_EFFECTS__
function _nonpositive(params) {
  return /* @__PURE__ */ _lte(0, params);
}
__name(_nonpositive, "_nonpositive");
// @__NO_SIDE_EFFECTS__
function _nonnegative(params) {
  return /* @__PURE__ */ _gte(0, params);
}
__name(_nonnegative, "_nonnegative");
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
__name(_multipleOf, "_multipleOf");
// @__NO_SIDE_EFFECTS__
function _maxSize(maximum, params) {
  return new $ZodCheckMaxSize({
    check: "max_size",
    ...normalizeParams(params),
    maximum
  });
}
__name(_maxSize, "_maxSize");
// @__NO_SIDE_EFFECTS__
function _minSize(minimum, params) {
  return new $ZodCheckMinSize({
    check: "min_size",
    ...normalizeParams(params),
    minimum
  });
}
__name(_minSize, "_minSize");
// @__NO_SIDE_EFFECTS__
function _size(size, params) {
  return new $ZodCheckSizeEquals({
    check: "size_equals",
    ...normalizeParams(params),
    size
  });
}
__name(_size, "_size");
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
__name(_maxLength, "_maxLength");
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
__name(_minLength, "_minLength");
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
__name(_length, "_length");
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
__name(_regex, "_regex");
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
__name(_lowercase, "_lowercase");
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
__name(_uppercase, "_uppercase");
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
__name(_includes, "_includes");
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
__name(_startsWith, "_startsWith");
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
__name(_endsWith, "_endsWith");
// @__NO_SIDE_EFFECTS__
function _property(property, schema, params) {
  return new $ZodCheckProperty({
    check: "property",
    property,
    schema,
    ...normalizeParams(params)
  });
}
__name(_property, "_property");
// @__NO_SIDE_EFFECTS__
function _mime(types, params) {
  return new $ZodCheckMimeType({
    check: "mime_type",
    mime: types,
    ...normalizeParams(params)
  });
}
__name(_mime, "_mime");
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
__name(_overwrite, "_overwrite");
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
  return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
__name(_normalize, "_normalize");
// @__NO_SIDE_EFFECTS__
function _trim() {
  return /* @__PURE__ */ _overwrite((input) => input.trim());
}
__name(_trim, "_trim");
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
__name(_toLowerCase, "_toLowerCase");
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
__name(_toUpperCase, "_toUpperCase");
// @__NO_SIDE_EFFECTS__
function _slugify() {
  return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
__name(_slugify, "_slugify");
// @__NO_SIDE_EFFECTS__
function _array(Class2, element, params) {
  return new Class2({
    type: "array",
    element,
    // get element() {
    //   return element;
    // },
    ...normalizeParams(params)
  });
}
__name(_array, "_array");
// @__NO_SIDE_EFFECTS__
function _union(Class2, options2, params) {
  return new Class2({
    type: "union",
    options: options2,
    ...normalizeParams(params)
  });
}
__name(_union, "_union");
function _xor(Class2, options2, params) {
  return new Class2({
    type: "union",
    options: options2,
    inclusive: false,
    ...normalizeParams(params)
  });
}
__name(_xor, "_xor");
// @__NO_SIDE_EFFECTS__
function _discriminatedUnion(Class2, discriminator, options2, params) {
  return new Class2({
    type: "union",
    options: options2,
    discriminator,
    ...normalizeParams(params)
  });
}
__name(_discriminatedUnion, "_discriminatedUnion");
// @__NO_SIDE_EFFECTS__
function _intersection(Class2, left, right) {
  return new Class2({
    type: "intersection",
    left,
    right
  });
}
__name(_intersection, "_intersection");
// @__NO_SIDE_EFFECTS__
function _tuple(Class2, items, _paramsOrRest, _params) {
  const hasRest = _paramsOrRest instanceof $ZodType;
  const params = hasRest ? _params : _paramsOrRest;
  const rest = hasRest ? _paramsOrRest : null;
  return new Class2({
    type: "tuple",
    items,
    rest,
    ...normalizeParams(params)
  });
}
__name(_tuple, "_tuple");
// @__NO_SIDE_EFFECTS__
function _record(Class2, keyType, valueType, params) {
  return new Class2({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
__name(_record, "_record");
// @__NO_SIDE_EFFECTS__
function _map(Class2, keyType, valueType, params) {
  return new Class2({
    type: "map",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
__name(_map, "_map");
// @__NO_SIDE_EFFECTS__
function _set(Class2, valueType, params) {
  return new Class2({
    type: "set",
    valueType,
    ...normalizeParams(params)
  });
}
__name(_set, "_set");
// @__NO_SIDE_EFFECTS__
function _enum(Class2, values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new Class2({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
__name(_enum, "_enum");
// @__NO_SIDE_EFFECTS__
function _nativeEnum(Class2, entries, params) {
  return new Class2({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
__name(_nativeEnum, "_nativeEnum");
// @__NO_SIDE_EFFECTS__
function _literal(Class2, value, params) {
  return new Class2({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams(params)
  });
}
__name(_literal, "_literal");
// @__NO_SIDE_EFFECTS__
function _file(Class2, params) {
  return new Class2({
    type: "file",
    ...normalizeParams(params)
  });
}
__name(_file, "_file");
// @__NO_SIDE_EFFECTS__
function _transform(Class2, fn) {
  return new Class2({
    type: "transform",
    transform: fn
  });
}
__name(_transform, "_transform");
// @__NO_SIDE_EFFECTS__
function _optional(Class2, innerType) {
  return new Class2({
    type: "optional",
    innerType
  });
}
__name(_optional, "_optional");
// @__NO_SIDE_EFFECTS__
function _nullable(Class2, innerType) {
  return new Class2({
    type: "nullable",
    innerType
  });
}
__name(_nullable, "_nullable");
// @__NO_SIDE_EFFECTS__
function _default(Class2, innerType, defaultValue) {
  return new Class2({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
__name(_default, "_default");
// @__NO_SIDE_EFFECTS__
function _nonoptional(Class2, innerType, params) {
  return new Class2({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
__name(_nonoptional, "_nonoptional");
// @__NO_SIDE_EFFECTS__
function _success(Class2, innerType) {
  return new Class2({
    type: "success",
    innerType
  });
}
__name(_success, "_success");
// @__NO_SIDE_EFFECTS__
function _catch(Class2, innerType, catchValue) {
  return new Class2({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
__name(_catch, "_catch");
// @__NO_SIDE_EFFECTS__
function _pipe(Class2, in_, out) {
  return new Class2({
    type: "pipe",
    in: in_,
    out
  });
}
__name(_pipe, "_pipe");
// @__NO_SIDE_EFFECTS__
function _readonly(Class2, innerType) {
  return new Class2({
    type: "readonly",
    innerType
  });
}
__name(_readonly, "_readonly");
// @__NO_SIDE_EFFECTS__
function _templateLiteral(Class2, parts, params) {
  return new Class2({
    type: "template_literal",
    parts,
    ...normalizeParams(params)
  });
}
__name(_templateLiteral, "_templateLiteral");
// @__NO_SIDE_EFFECTS__
function _lazy(Class2, getter) {
  return new Class2({
    type: "lazy",
    getter
  });
}
__name(_lazy, "_lazy");
// @__NO_SIDE_EFFECTS__
function _promise(Class2, innerType) {
  return new Class2({
    type: "promise",
    innerType
  });
}
__name(_promise, "_promise");
// @__NO_SIDE_EFFECTS__
function _custom(Class2, fn, _params) {
  const norm = normalizeParams(_params);
  norm.abort ?? (norm.abort = true);
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
  return schema;
}
__name(_custom, "_custom");
// @__NO_SIDE_EFFECTS__
function _refine(Class2, fn, _params) {
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
__name(_refine, "_refine");
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
  const ch = /* @__PURE__ */ _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
__name(_superRefine, "_superRefine");
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
__name(_check, "_check");
// @__NO_SIDE_EFFECTS__
function describe(description) {
  const ch = new $ZodCheck({ check: "describe" });
  ch._zod.onattach = [
    (inst) => {
      const existing = globalRegistry.get(inst) ?? {};
      globalRegistry.add(inst, { ...existing, description });
    }
  ];
  ch._zod.check = () => {
  };
  return ch;
}
__name(describe, "describe");
// @__NO_SIDE_EFFECTS__
function meta(metadata) {
  const ch = new $ZodCheck({ check: "meta" });
  ch._zod.onattach = [
    (inst) => {
      const existing = globalRegistry.get(inst) ?? {};
      globalRegistry.add(inst, { ...existing, ...metadata });
    }
  ];
  ch._zod.check = () => {
  };
  return ch;
}
__name(meta, "meta");
// @__NO_SIDE_EFFECTS__
function _stringbool(Classes, _params) {
  const params = normalizeParams(_params);
  let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
  let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  if (params.case !== "sensitive") {
    truthyArray = truthyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
    falsyArray = falsyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
  }
  const truthySet = new Set(truthyArray);
  const falsySet = new Set(falsyArray);
  const _Codec = Classes.Codec ?? $ZodCodec;
  const _Boolean = Classes.Boolean ?? $ZodBoolean;
  const _String = Classes.String ?? $ZodString;
  const stringSchema = new _String({ type: "string", error: params.error });
  const booleanSchema = new _Boolean({ type: "boolean", error: params.error });
  const codec2 = new _Codec({
    type: "pipe",
    in: stringSchema,
    out: booleanSchema,
    transform: /* @__PURE__ */ __name((input, payload) => {
      let data = input;
      if (params.case !== "sensitive")
        data = data.toLowerCase();
      if (truthySet.has(data)) {
        return true;
      } else if (falsySet.has(data)) {
        return false;
      } else {
        payload.issues.push({
          code: "invalid_value",
          expected: "stringbool",
          values: [...truthySet, ...falsySet],
          input: payload.value,
          inst: codec2,
          continue: false
        });
        return {};
      }
    }, "transform"),
    reverseTransform: /* @__PURE__ */ __name((input, _payload) => {
      if (input === true) {
        return truthyArray[0] || "true";
      } else {
        return falsyArray[0] || "false";
      }
    }, "reverseTransform"),
    error: params.error
  });
  return codec2;
}
__name(_stringbool, "_stringbool");
// @__NO_SIDE_EFFECTS__
function _stringFormat(Class2, format, fnOrRegex, _params = {}) {
  const params = normalizeParams(_params);
  const def2 = {
    ...normalizeParams(_params),
    check: "string_format",
    type: "string",
    format,
    fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
    ...params
  };
  if (fnOrRegex instanceof RegExp) {
    def2.pattern = fnOrRegex;
  }
  const inst = new Class2(def2);
  return inst;
}
__name(_stringFormat, "_stringFormat");

// node_modules/zod/v4/core/to-json-schema.js
init_esm();
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? void 0
  };
}
__name(initializeContext, "initializeContext");
function process2(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a3;
  const def2 = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def2.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def2.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process2(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta3 = ctx.metadataRegistry.get(schema);
  if (meta3)
    Object.assign(result.schema, meta3);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a3 = result.schema).default ?? (_a3.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
__name(process2, "process");
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = /* @__PURE__ */ __name((entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id2) => id2);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  }, "makeURI");
  const extractToDef = /* @__PURE__ */ __name((entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) {
      delete schema2[key];
    }
    schema2.$ref = ref;
  }, "extractToDef");
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
__name(extractDefs, "extractDefs");
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = /* @__PURE__ */ __name((zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else {
        Object.assign(schema2, refSchema);
      }
      Object.assign(schema2, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema2[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema2[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  }, "flattenRef");
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {
  } else {
  }
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId)
        delete seen.def.id;
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) {
  } else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
__name(finalize, "finalize");
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def2 = _schema._zod.def;
  if (def2.type === "transform")
    return true;
  if (def2.type === "array")
    return isTransforming(def2.element, ctx);
  if (def2.type === "set")
    return isTransforming(def2.valueType, ctx);
  if (def2.type === "lazy")
    return isTransforming(def2.getter(), ctx);
  if (def2.type === "promise" || def2.type === "optional" || def2.type === "nonoptional" || def2.type === "nullable" || def2.type === "readonly" || def2.type === "default" || def2.type === "prefault") {
    return isTransforming(def2.innerType, ctx);
  }
  if (def2.type === "intersection") {
    return isTransforming(def2.left, ctx) || isTransforming(def2.right, ctx);
  }
  if (def2.type === "record" || def2.type === "map") {
    return isTransforming(def2.keyType, ctx) || isTransforming(def2.valueType, ctx);
  }
  if (def2.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def2.in, ctx) || isTransforming(def2.out, ctx);
  }
  if (def2.type === "object") {
    for (const key in def2.shape) {
      if (isTransforming(def2.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def2.type === "union") {
    for (const option of def2.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def2.type === "tuple") {
    for (const item of def2.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def2.rest && isTransforming(def2.rest, ctx))
      return true;
    return false;
  }
  return false;
}
__name(isTransforming, "isTransforming");
var createToJSONSchemaMethod = /* @__PURE__ */ __name((schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  process2(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
}, "createToJSONSchemaMethod");
var createStandardJSONSchemaMethod = /* @__PURE__ */ __name((schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process2(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
}, "createStandardJSONSchemaMethod");

// node_modules/zod/v4/core/json-schema-processors.js
init_esm();
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
};
var stringProcessor = /* @__PURE__ */ __name((schema, ctx, _json, _params) => {
  const json2 = _json;
  json2.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json2.minLength = minimum;
  if (typeof maximum === "number")
    json2.maxLength = maximum;
  if (format) {
    json2.format = formatMap[format] ?? format;
    if (json2.format === "")
      delete json2.format;
    if (format === "time") {
      delete json2.format;
    }
  }
  if (contentEncoding)
    json2.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const regexes = [...patterns];
    if (regexes.length === 1)
      json2.pattern = regexes[0].source;
    else if (regexes.length > 1) {
      json2.allOf = [
        ...regexes.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
}, "stringProcessor");
var numberProcessor = /* @__PURE__ */ __name((schema, ctx, _json, _params) => {
  const json2 = _json;
  const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
  if (typeof format === "string" && format.includes("int"))
    json2.type = "integer";
  else
    json2.type = "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json2.minimum = exclusiveMinimum;
      json2.exclusiveMinimum = true;
    } else {
      json2.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json2.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json2.maximum = exclusiveMaximum;
      json2.exclusiveMaximum = true;
    } else {
      json2.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json2.maximum = maximum;
  }
  if (typeof multipleOf === "number")
    json2.multipleOf = multipleOf;
}, "numberProcessor");
var booleanProcessor = /* @__PURE__ */ __name((_schema, _ctx, json2, _params) => {
  json2.type = "boolean";
}, "booleanProcessor");
var bigintProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("BigInt cannot be represented in JSON Schema");
  }
}, "bigintProcessor");
var symbolProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Symbols cannot be represented in JSON Schema");
  }
}, "symbolProcessor");
var nullProcessor = /* @__PURE__ */ __name((_schema, ctx, json2, _params) => {
  if (ctx.target === "openapi-3.0") {
    json2.type = "string";
    json2.nullable = true;
    json2.enum = [null];
  } else {
    json2.type = "null";
  }
}, "nullProcessor");
var undefinedProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Undefined cannot be represented in JSON Schema");
  }
}, "undefinedProcessor");
var voidProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Void cannot be represented in JSON Schema");
  }
}, "voidProcessor");
var neverProcessor = /* @__PURE__ */ __name((_schema, _ctx, json2, _params) => {
  json2.not = {};
}, "neverProcessor");
var anyProcessor = /* @__PURE__ */ __name((_schema, _ctx, _json, _params) => {
}, "anyProcessor");
var unknownProcessor = /* @__PURE__ */ __name((_schema, _ctx, _json, _params) => {
}, "unknownProcessor");
var dateProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Date cannot be represented in JSON Schema");
  }
}, "dateProcessor");
var enumProcessor = /* @__PURE__ */ __name((schema, _ctx, json2, _params) => {
  const def2 = schema._zod.def;
  const values = getEnumValues(def2.entries);
  if (values.every((v) => typeof v === "number"))
    json2.type = "number";
  if (values.every((v) => typeof v === "string"))
    json2.type = "string";
  json2.enum = values;
}, "enumProcessor");
var literalProcessor = /* @__PURE__ */ __name((schema, ctx, json2, _params) => {
  const def2 = schema._zod.def;
  const vals = [];
  for (const val of def2.values) {
    if (val === void 0) {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
      } else {
      }
    } else if (typeof val === "bigint") {
      if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      } else {
        vals.push(Number(val));
      }
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {
  } else if (vals.length === 1) {
    const val = vals[0];
    json2.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json2.enum = [val];
    } else {
      json2.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json2.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json2.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json2.type = "boolean";
    if (vals.every((v) => v === null))
      json2.type = "null";
    json2.enum = vals;
  }
}, "literalProcessor");
var nanProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("NaN cannot be represented in JSON Schema");
  }
}, "nanProcessor");
var templateLiteralProcessor = /* @__PURE__ */ __name((schema, _ctx, json2, _params) => {
  const _json = json2;
  const pattern = schema._zod.pattern;
  if (!pattern)
    throw new Error("Pattern not found in template literal");
  _json.type = "string";
  _json.pattern = pattern.source;
}, "templateLiteralProcessor");
var fileProcessor = /* @__PURE__ */ __name((schema, _ctx, json2, _params) => {
  const _json = json2;
  const file2 = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  };
  const { minimum, maximum, mime } = schema._zod.bag;
  if (minimum !== void 0)
    file2.minLength = minimum;
  if (maximum !== void 0)
    file2.maxLength = maximum;
  if (mime) {
    if (mime.length === 1) {
      file2.contentMediaType = mime[0];
      Object.assign(_json, file2);
    } else {
      Object.assign(_json, file2);
      _json.anyOf = mime.map((m) => ({ contentMediaType: m }));
    }
  } else {
    Object.assign(_json, file2);
  }
}, "fileProcessor");
var successProcessor = /* @__PURE__ */ __name((_schema, _ctx, json2, _params) => {
  json2.type = "boolean";
}, "successProcessor");
var customProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Custom types cannot be represented in JSON Schema");
  }
}, "customProcessor");
var functionProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Function types cannot be represented in JSON Schema");
  }
}, "functionProcessor");
var transformProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Transforms cannot be represented in JSON Schema");
  }
}, "transformProcessor");
var mapProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Map cannot be represented in JSON Schema");
  }
}, "mapProcessor");
var setProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Set cannot be represented in JSON Schema");
  }
}, "setProcessor");
var arrayProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const json2 = _json;
  const def2 = schema._zod.def;
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json2.minItems = minimum;
  if (typeof maximum === "number")
    json2.maxItems = maximum;
  json2.type = "array";
  json2.items = process2(def2.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
}, "arrayProcessor");
var objectProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const json2 = _json;
  const def2 = schema._zod.def;
  json2.type = "object";
  json2.properties = {};
  const shape = def2.shape;
  for (const key in shape) {
    json2.properties[key] = process2(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    });
  }
  const allKeys = new Set(Object.keys(shape));
  const requiredKeys = new Set([...allKeys].filter((key) => {
    const v = def2.shape[key]._zod;
    if (ctx.io === "input") {
      return v.optin === void 0;
    } else {
      return v.optout === void 0;
    }
  }));
  if (requiredKeys.size > 0) {
    json2.required = Array.from(requiredKeys);
  }
  if (def2.catchall?._zod.def.type === "never") {
    json2.additionalProperties = false;
  } else if (!def2.catchall) {
    if (ctx.io === "output")
      json2.additionalProperties = false;
  } else if (def2.catchall) {
    json2.additionalProperties = process2(def2.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
}, "objectProcessor");
var unionProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def2 = schema._zod.def;
  const isExclusive = def2.inclusive === false;
  const options2 = def2.options.map((x, i) => process2(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json2.oneOf = options2;
  } else {
    json2.anyOf = options2;
  }
}, "unionProcessor");
var intersectionProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def2 = schema._zod.def;
  const a = process2(def2.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = process2(def2.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = /* @__PURE__ */ __name((val) => "allOf" in val && Object.keys(val).length === 1, "isSimpleIntersection");
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json2.allOf = allOf;
}, "intersectionProcessor");
var tupleProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const json2 = _json;
  const def2 = schema._zod.def;
  json2.type = "array";
  const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
  const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
  const prefixItems = def2.items.map((x, i) => process2(x, ctx, {
    ...params,
    path: [...params.path, prefixPath, i]
  }));
  const rest = def2.rest ? process2(def2.rest, ctx, {
    ...params,
    path: [...params.path, restPath, ...ctx.target === "openapi-3.0" ? [def2.items.length] : []]
  }) : null;
  if (ctx.target === "draft-2020-12") {
    json2.prefixItems = prefixItems;
    if (rest) {
      json2.items = rest;
    }
  } else if (ctx.target === "openapi-3.0") {
    json2.items = {
      anyOf: prefixItems
    };
    if (rest) {
      json2.items.anyOf.push(rest);
    }
    json2.minItems = prefixItems.length;
    if (!rest) {
      json2.maxItems = prefixItems.length;
    }
  } else {
    json2.items = prefixItems;
    if (rest) {
      json2.additionalItems = rest;
    }
  }
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json2.minItems = minimum;
  if (typeof maximum === "number")
    json2.maxItems = maximum;
}, "tupleProcessor");
var recordProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const json2 = _json;
  const def2 = schema._zod.def;
  json2.type = "object";
  const keyType = def2.keyType;
  const keyBag = keyType._zod.bag;
  const patterns = keyBag?.patterns;
  if (def2.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = process2(def2.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json2.patternProperties = {};
    for (const pattern of patterns) {
      json2.patternProperties[pattern.source] = valueSchema;
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json2.propertyNames = process2(def2.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
    }
    json2.additionalProperties = process2(def2.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  if (keyValues) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json2.required = validKeyValues;
    }
  }
}, "recordProcessor");
var nullableProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def2 = schema._zod.def;
  const inner = process2(def2.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def2.innerType;
    json2.nullable = true;
  } else {
    json2.anyOf = [inner, { type: "null" }];
  }
}, "nullableProcessor");
var nonoptionalProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const def2 = schema._zod.def;
  process2(def2.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def2.innerType;
}, "nonoptionalProcessor");
var defaultProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def2 = schema._zod.def;
  process2(def2.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def2.innerType;
  json2.default = JSON.parse(JSON.stringify(def2.defaultValue));
}, "defaultProcessor");
var prefaultProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def2 = schema._zod.def;
  process2(def2.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def2.innerType;
  if (ctx.io === "input")
    json2._prefault = JSON.parse(JSON.stringify(def2.defaultValue));
}, "prefaultProcessor");
var catchProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def2 = schema._zod.def;
  process2(def2.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def2.innerType;
  let catchValue;
  try {
    catchValue = def2.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  json2.default = catchValue;
}, "catchProcessor");
var pipeProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const def2 = schema._zod.def;
  const inIsTransform = def2.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def2.out : def2.in : def2.out;
  process2(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
}, "pipeProcessor");
var readonlyProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def2 = schema._zod.def;
  process2(def2.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def2.innerType;
  json2.readOnly = true;
}, "readonlyProcessor");
var promiseProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const def2 = schema._zod.def;
  process2(def2.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def2.innerType;
}, "promiseProcessor");
var optionalProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const def2 = schema._zod.def;
  process2(def2.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def2.innerType;
}, "optionalProcessor");
var lazyProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const innerType = schema._zod.innerType;
  process2(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
}, "lazyProcessor");
var allProcessors = {
  string: stringProcessor,
  number: numberProcessor,
  boolean: booleanProcessor,
  bigint: bigintProcessor,
  symbol: symbolProcessor,
  null: nullProcessor,
  undefined: undefinedProcessor,
  void: voidProcessor,
  never: neverProcessor,
  any: anyProcessor,
  unknown: unknownProcessor,
  date: dateProcessor,
  enum: enumProcessor,
  literal: literalProcessor,
  nan: nanProcessor,
  template_literal: templateLiteralProcessor,
  file: fileProcessor,
  success: successProcessor,
  custom: customProcessor,
  function: functionProcessor,
  transform: transformProcessor,
  map: mapProcessor,
  set: setProcessor,
  array: arrayProcessor,
  object: objectProcessor,
  union: unionProcessor,
  intersection: intersectionProcessor,
  tuple: tupleProcessor,
  record: recordProcessor,
  nullable: nullableProcessor,
  nonoptional: nonoptionalProcessor,
  default: defaultProcessor,
  prefault: prefaultProcessor,
  catch: catchProcessor,
  pipe: pipeProcessor,
  readonly: readonlyProcessor,
  promise: promiseProcessor,
  optional: optionalProcessor,
  lazy: lazyProcessor
};
function toJSONSchema(input, params) {
  if ("_idmap" in input) {
    const registry2 = input;
    const ctx2 = initializeContext({ ...params, processors: allProcessors });
    const defs = {};
    for (const entry of registry2._idmap.entries()) {
      const [_, schema] = entry;
      process2(schema, ctx2);
    }
    const schemas = {};
    const external = {
      registry: registry2,
      uri: params?.uri,
      defs
    };
    ctx2.external = external;
    for (const entry of registry2._idmap.entries()) {
      const [key, schema] = entry;
      extractDefs(ctx2, schema);
      schemas[key] = finalize(ctx2, schema);
    }
    if (Object.keys(defs).length > 0) {
      const defsSegment = ctx2.target === "draft-2020-12" ? "$defs" : "definitions";
      schemas.__shared = {
        [defsSegment]: defs
      };
    }
    return { schemas };
  }
  const ctx = initializeContext({ ...params, processors: allProcessors });
  process2(input, ctx);
  extractDefs(ctx, input);
  return finalize(ctx, input);
}
__name(toJSONSchema, "toJSONSchema");

// node_modules/zod/v4/core/json-schema-generator.js
init_esm();
var JSONSchemaGenerator = class {
  static {
    __name(this, "JSONSchemaGenerator");
  }
  /** @deprecated Access via ctx instead */
  get metadataRegistry() {
    return this.ctx.metadataRegistry;
  }
  /** @deprecated Access via ctx instead */
  get target() {
    return this.ctx.target;
  }
  /** @deprecated Access via ctx instead */
  get unrepresentable() {
    return this.ctx.unrepresentable;
  }
  /** @deprecated Access via ctx instead */
  get override() {
    return this.ctx.override;
  }
  /** @deprecated Access via ctx instead */
  get io() {
    return this.ctx.io;
  }
  /** @deprecated Access via ctx instead */
  get counter() {
    return this.ctx.counter;
  }
  set counter(value) {
    this.ctx.counter = value;
  }
  /** @deprecated Access via ctx instead */
  get seen() {
    return this.ctx.seen;
  }
  constructor(params) {
    let normalizedTarget = params?.target ?? "draft-2020-12";
    if (normalizedTarget === "draft-4")
      normalizedTarget = "draft-04";
    if (normalizedTarget === "draft-7")
      normalizedTarget = "draft-07";
    this.ctx = initializeContext({
      processors: allProcessors,
      target: normalizedTarget,
      ...params?.metadata && { metadata: params.metadata },
      ...params?.unrepresentable && { unrepresentable: params.unrepresentable },
      ...params?.override && { override: params.override },
      ...params?.io && { io: params.io }
    });
  }
  /**
   * Process a schema to prepare it for JSON Schema generation.
   * This must be called before emit().
   */
  process(schema, _params = { path: [], schemaPath: [] }) {
    return process2(schema, this.ctx, _params);
  }
  /**
   * Emit the final JSON Schema after processing.
   * Must call process() first.
   */
  emit(schema, _params) {
    if (_params) {
      if (_params.cycles)
        this.ctx.cycles = _params.cycles;
      if (_params.reused)
        this.ctx.reused = _params.reused;
      if (_params.external)
        this.ctx.external = _params.external;
    }
    extractDefs(this.ctx, schema);
    const result = finalize(this.ctx, schema);
    const { "~standard": _, ...plainResult } = result;
    return plainResult;
  }
};

// node_modules/zod/v4/core/json-schema.js
var json_schema_exports = {};
init_esm();

// node_modules/zod/v4/classic/schemas.js
var schemas_exports2 = {};
__export(schemas_exports2, {
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBase64: () => ZodBase64,
  ZodBase64URL: () => ZodBase64URL,
  ZodBigInt: () => ZodBigInt,
  ZodBigIntFormat: () => ZodBigIntFormat,
  ZodBoolean: () => ZodBoolean,
  ZodCIDRv4: () => ZodCIDRv4,
  ZodCIDRv6: () => ZodCIDRv6,
  ZodCUID: () => ZodCUID,
  ZodCUID2: () => ZodCUID2,
  ZodCatch: () => ZodCatch,
  ZodCodec: () => ZodCodec,
  ZodCustom: () => ZodCustom,
  ZodCustomStringFormat: () => ZodCustomStringFormat,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodE164: () => ZodE164,
  ZodEmail: () => ZodEmail,
  ZodEmoji: () => ZodEmoji,
  ZodEnum: () => ZodEnum,
  ZodExactOptional: () => ZodExactOptional,
  ZodFile: () => ZodFile,
  ZodFunction: () => ZodFunction,
  ZodGUID: () => ZodGUID,
  ZodIPv4: () => ZodIPv4,
  ZodIPv6: () => ZodIPv6,
  ZodIntersection: () => ZodIntersection,
  ZodJWT: () => ZodJWT,
  ZodKSUID: () => ZodKSUID,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMAC: () => ZodMAC,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNanoID: () => ZodNanoID,
  ZodNever: () => ZodNever,
  ZodNonOptional: () => ZodNonOptional,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodNumberFormat: () => ZodNumberFormat,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodPipe: () => ZodPipe,
  ZodPrefault: () => ZodPrefault,
  ZodPreprocess: () => ZodPreprocess,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodStringFormat: () => ZodStringFormat,
  ZodSuccess: () => ZodSuccess,
  ZodSymbol: () => ZodSymbol,
  ZodTemplateLiteral: () => ZodTemplateLiteral,
  ZodTransform: () => ZodTransform,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodULID: () => ZodULID,
  ZodURL: () => ZodURL,
  ZodUUID: () => ZodUUID,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  ZodXID: () => ZodXID,
  ZodXor: () => ZodXor,
  _ZodString: () => _ZodString,
  _default: () => _default2,
  _function: () => _function,
  any: () => any,
  array: () => array,
  base64: () => base642,
  base64url: () => base64url2,
  bigint: () => bigint2,
  boolean: () => boolean2,
  catch: () => _catch2,
  check: () => check,
  cidrv4: () => cidrv42,
  cidrv6: () => cidrv62,
  codec: () => codec,
  cuid: () => cuid3,
  cuid2: () => cuid22,
  custom: () => custom,
  date: () => date3,
  describe: () => describe2,
  discriminatedUnion: () => discriminatedUnion,
  e164: () => e1642,
  email: () => email2,
  emoji: () => emoji2,
  enum: () => _enum2,
  exactOptional: () => exactOptional,
  file: () => file,
  float32: () => float32,
  float64: () => float64,
  function: () => _function,
  guid: () => guid2,
  hash: () => hash,
  hex: () => hex2,
  hostname: () => hostname2,
  httpUrl: () => httpUrl,
  instanceof: () => _instanceof,
  int: () => int,
  int32: () => int32,
  int64: () => int64,
  intersection: () => intersection,
  invertCodec: () => invertCodec,
  ipv4: () => ipv42,
  ipv6: () => ipv62,
  json: () => json,
  jwt: () => jwt,
  keyof: () => keyof,
  ksuid: () => ksuid2,
  lazy: () => lazy,
  literal: () => literal,
  looseObject: () => looseObject,
  looseRecord: () => looseRecord,
  mac: () => mac2,
  map: () => map,
  meta: () => meta2,
  nan: () => nan,
  nanoid: () => nanoid2,
  nativeEnum: () => nativeEnum,
  never: () => never,
  nonoptional: () => nonoptional,
  null: () => _null3,
  nullable: () => nullable,
  nullish: () => nullish2,
  number: () => number2,
  object: () => object,
  optional: () => optional,
  partialRecord: () => partialRecord,
  pipe: () => pipe,
  prefault: () => prefault,
  preprocess: () => preprocess,
  promise: () => promise,
  readonly: () => readonly,
  record: () => record,
  refine: () => refine,
  set: () => set,
  strictObject: () => strictObject,
  string: () => string2,
  stringFormat: () => stringFormat,
  stringbool: () => stringbool,
  success: () => success,
  superRefine: () => superRefine,
  symbol: () => symbol,
  templateLiteral: () => templateLiteral,
  transform: () => transform,
  tuple: () => tuple,
  uint32: () => uint32,
  uint64: () => uint64,
  ulid: () => ulid2,
  undefined: () => _undefined3,
  union: () => union,
  unknown: () => unknown,
  url: () => url,
  uuid: () => uuid2,
  uuidv4: () => uuidv4,
  uuidv6: () => uuidv6,
  uuidv7: () => uuidv7,
  void: () => _void2,
  xid: () => xid2,
  xor: () => xor
});
init_esm();

// node_modules/zod/v4/classic/checks.js
var checks_exports2 = {};
__export(checks_exports2, {
  endsWith: () => _endsWith,
  gt: () => _gt,
  gte: () => _gte,
  includes: () => _includes,
  length: () => _length,
  lowercase: () => _lowercase,
  lt: () => _lt,
  lte: () => _lte,
  maxLength: () => _maxLength,
  maxSize: () => _maxSize,
  mime: () => _mime,
  minLength: () => _minLength,
  minSize: () => _minSize,
  multipleOf: () => _multipleOf,
  negative: () => _negative,
  nonnegative: () => _nonnegative,
  nonpositive: () => _nonpositive,
  normalize: () => _normalize,
  overwrite: () => _overwrite,
  positive: () => _positive,
  property: () => _property,
  regex: () => _regex,
  size: () => _size,
  slugify: () => _slugify,
  startsWith: () => _startsWith,
  toLowerCase: () => _toLowerCase,
  toUpperCase: () => _toUpperCase,
  trim: () => _trim,
  uppercase: () => _uppercase
});
init_esm();

// node_modules/zod/v4/classic/iso.js
var iso_exports = {};
__export(iso_exports, {
  ZodISODate: () => ZodISODate,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODuration: () => ZodISODuration,
  ZodISOTime: () => ZodISOTime,
  date: () => date2,
  datetime: () => datetime2,
  duration: () => duration2,
  time: () => time2
});
init_esm();
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def2) => {
  $ZodISODateTime.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
__name(datetime2, "datetime");
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def2) => {
  $ZodISODate.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function date2(params) {
  return _isoDate(ZodISODate, params);
}
__name(date2, "date");
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def2) => {
  $ZodISOTime.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
__name(time2, "time");
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def2) => {
  $ZodISODuration.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}
__name(duration2, "duration");

// node_modules/zod/v4/classic/parse.js
init_esm();

// node_modules/zod/v4/classic/errors.js
init_esm();
var initializer2 = /* @__PURE__ */ __name((inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: /* @__PURE__ */ __name((mapper) => formatError(inst, mapper), "value")
      // enumerable: false,
    },
    flatten: {
      value: /* @__PURE__ */ __name((mapper) => flattenError(inst, mapper), "value")
      // enumerable: false,
    },
    addIssue: {
      value: /* @__PURE__ */ __name((issue2) => {
        inst.issues.push(issue2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }, "value")
      // enumerable: false,
    },
    addIssues: {
      value: /* @__PURE__ */ __name((issues2) => {
        inst.issues.push(...issues2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }, "value")
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, "initializer");
var ZodError = /* @__PURE__ */ $constructor("ZodError", initializer2);
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse2 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode2 = /* @__PURE__ */ _encode(ZodRealError);
var decode2 = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync2 = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync2 = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode2 = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode2 = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync2 = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync2 = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
var _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
  const proto = Object.getPrototypeOf(inst);
  let installed = _installedGroups.get(proto);
  if (!installed) {
    installed = /* @__PURE__ */ new Set();
    _installedGroups.set(proto, installed);
  }
  if (installed.has(group))
    return;
  installed.add(group);
  for (const key in methods) {
    const fn = methods[key];
    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: false,
      get() {
        const bound = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: bound
        });
        return bound;
      },
      set(v) {
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: v
        });
      }
    });
  }
}
__name(_installLazyMethods, "_installLazyMethods");
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def2) => {
  $ZodType.init(inst, def2);
  Object.assign(inst["~standard"], {
    jsonSchema: {
      input: createStandardJSONSchemaMethod(inst, "input"),
      output: createStandardJSONSchemaMethod(inst, "output")
    }
  });
  inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
  inst.def = def2;
  inst.type = def2.type;
  Object.defineProperty(inst, "_def", { value: def2 });
  inst.parse = (data, params) => parse2(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse2(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.encode = (data, params) => encode2(inst, data, params);
  inst.decode = (data, params) => decode2(inst, data, params);
  inst.encodeAsync = async (data, params) => encodeAsync2(inst, data, params);
  inst.decodeAsync = async (data, params) => decodeAsync2(inst, data, params);
  inst.safeEncode = (data, params) => safeEncode2(inst, data, params);
  inst.safeDecode = (data, params) => safeDecode2(inst, data, params);
  inst.safeEncodeAsync = async (data, params) => safeEncodeAsync2(inst, data, params);
  inst.safeDecodeAsync = async (data, params) => safeDecodeAsync2(inst, data, params);
  _installLazyMethods(inst, "ZodType", {
    check(...chks) {
      const def3 = this.def;
      return this.clone(util_exports.mergeDefs(def3, {
        checks: [
          ...def3.checks ?? [],
          ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), { parent: true });
    },
    with(...chks) {
      return this.check(...chks);
    },
    clone(def3, params) {
      return clone(this, def3, params);
    },
    brand() {
      return this;
    },
    register(reg, meta3) {
      reg.add(this, meta3);
      return this;
    },
    refine(check2, params) {
      return this.check(refine(check2, params));
    },
    superRefine(refinement, params) {
      return this.check(superRefine(refinement, params));
    },
    overwrite(fn) {
      return this.check(_overwrite(fn));
    },
    optional() {
      return optional(this);
    },
    exactOptional() {
      return exactOptional(this);
    },
    nullable() {
      return nullable(this);
    },
    nullish() {
      return optional(nullable(this));
    },
    nonoptional(params) {
      return nonoptional(this, params);
    },
    array() {
      return array(this);
    },
    or(arg) {
      return union([this, arg]);
    },
    and(arg) {
      return intersection(this, arg);
    },
    transform(tx) {
      return pipe(this, transform(tx));
    },
    default(d) {
      return _default2(this, d);
    },
    prefault(d) {
      return prefault(this, d);
    },
    catch(params) {
      return _catch2(this, params);
    },
    pipe(target) {
      return pipe(this, target);
    },
    readonly() {
      return readonly(this);
    },
    describe(description) {
      const cl = this.clone();
      globalRegistry.add(cl, { description });
      return cl;
    },
    meta(...args) {
      if (args.length === 0)
        return globalRegistry.get(this);
      const cl = this.clone();
      globalRegistry.add(cl, args[0]);
      return cl;
    },
    isOptional() {
      return this.safeParse(void 0).success;
    },
    isNullable() {
      return this.safeParse(null).success;
    },
    apply(fn) {
      return fn(this);
    }
  });
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  return inst;
});
var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def2) => {
  $ZodString.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => stringProcessor(inst, ctx, json2, params);
  const bag = inst._zod.bag;
  inst.format = bag.format ?? null;
  inst.minLength = bag.minimum ?? null;
  inst.maxLength = bag.maximum ?? null;
  _installLazyMethods(inst, "_ZodString", {
    regex(...args) {
      return this.check(_regex(...args));
    },
    includes(...args) {
      return this.check(_includes(...args));
    },
    startsWith(...args) {
      return this.check(_startsWith(...args));
    },
    endsWith(...args) {
      return this.check(_endsWith(...args));
    },
    min(...args) {
      return this.check(_minLength(...args));
    },
    max(...args) {
      return this.check(_maxLength(...args));
    },
    length(...args) {
      return this.check(_length(...args));
    },
    nonempty(...args) {
      return this.check(_minLength(1, ...args));
    },
    lowercase(params) {
      return this.check(_lowercase(params));
    },
    uppercase(params) {
      return this.check(_uppercase(params));
    },
    trim() {
      return this.check(_trim());
    },
    normalize(...args) {
      return this.check(_normalize(...args));
    },
    toLowerCase() {
      return this.check(_toLowerCase());
    },
    toUpperCase() {
      return this.check(_toUpperCase());
    },
    slugify() {
      return this.check(_slugify());
    }
  });
});
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def2) => {
  $ZodString.init(inst, def2);
  _ZodString.init(inst, def2);
  inst.email = (params) => inst.check(_email(ZodEmail, params));
  inst.url = (params) => inst.check(_url(ZodURL, params));
  inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
  inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
  inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
  inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
  inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
  inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
  inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
  inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
  inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
  inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
  inst.xid = (params) => inst.check(_xid(ZodXID, params));
  inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
  inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
  inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
  inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
  inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
  inst.e164 = (params) => inst.check(_e164(ZodE164, params));
  inst.datetime = (params) => inst.check(datetime2(params));
  inst.date = (params) => inst.check(date2(params));
  inst.time = (params) => inst.check(time2(params));
  inst.duration = (params) => inst.check(duration2(params));
});
function string2(params) {
  return _string(ZodString, params);
}
__name(string2, "string");
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def2) => {
  $ZodStringFormat.init(inst, def2);
  _ZodString.init(inst, def2);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def2) => {
  $ZodEmail.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function email2(params) {
  return _email(ZodEmail, params);
}
__name(email2, "email");
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def2) => {
  $ZodGUID.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function guid2(params) {
  return _guid(ZodGUID, params);
}
__name(guid2, "guid");
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def2) => {
  $ZodUUID.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function uuid2(params) {
  return _uuid(ZodUUID, params);
}
__name(uuid2, "uuid");
function uuidv4(params) {
  return _uuidv4(ZodUUID, params);
}
__name(uuidv4, "uuidv4");
function uuidv6(params) {
  return _uuidv6(ZodUUID, params);
}
__name(uuidv6, "uuidv6");
function uuidv7(params) {
  return _uuidv7(ZodUUID, params);
}
__name(uuidv7, "uuidv7");
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def2) => {
  $ZodURL.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function url(params) {
  return _url(ZodURL, params);
}
__name(url, "url");
function httpUrl(params) {
  return _url(ZodURL, {
    protocol: regexes_exports.httpProtocol,
    hostname: regexes_exports.domain,
    ...util_exports.normalizeParams(params)
  });
}
__name(httpUrl, "httpUrl");
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def2) => {
  $ZodEmoji.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function emoji2(params) {
  return _emoji2(ZodEmoji, params);
}
__name(emoji2, "emoji");
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def2) => {
  $ZodNanoID.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function nanoid2(params) {
  return _nanoid(ZodNanoID, params);
}
__name(nanoid2, "nanoid");
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def2) => {
  $ZodCUID.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function cuid3(params) {
  return _cuid(ZodCUID, params);
}
__name(cuid3, "cuid");
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def2) => {
  $ZodCUID2.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function cuid22(params) {
  return _cuid2(ZodCUID2, params);
}
__name(cuid22, "cuid2");
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def2) => {
  $ZodULID.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function ulid2(params) {
  return _ulid(ZodULID, params);
}
__name(ulid2, "ulid");
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def2) => {
  $ZodXID.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function xid2(params) {
  return _xid(ZodXID, params);
}
__name(xid2, "xid");
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def2) => {
  $ZodKSUID.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function ksuid2(params) {
  return _ksuid(ZodKSUID, params);
}
__name(ksuid2, "ksuid");
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def2) => {
  $ZodIPv4.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function ipv42(params) {
  return _ipv4(ZodIPv4, params);
}
__name(ipv42, "ipv4");
var ZodMAC = /* @__PURE__ */ $constructor("ZodMAC", (inst, def2) => {
  $ZodMAC.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function mac2(params) {
  return _mac(ZodMAC, params);
}
__name(mac2, "mac");
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def2) => {
  $ZodIPv6.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function ipv62(params) {
  return _ipv6(ZodIPv6, params);
}
__name(ipv62, "ipv6");
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def2) => {
  $ZodCIDRv4.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function cidrv42(params) {
  return _cidrv4(ZodCIDRv4, params);
}
__name(cidrv42, "cidrv4");
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def2) => {
  $ZodCIDRv6.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function cidrv62(params) {
  return _cidrv6(ZodCIDRv6, params);
}
__name(cidrv62, "cidrv6");
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def2) => {
  $ZodBase64.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function base642(params) {
  return _base64(ZodBase64, params);
}
__name(base642, "base64");
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def2) => {
  $ZodBase64URL.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function base64url2(params) {
  return _base64url(ZodBase64URL, params);
}
__name(base64url2, "base64url");
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def2) => {
  $ZodE164.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function e1642(params) {
  return _e164(ZodE164, params);
}
__name(e1642, "e164");
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def2) => {
  $ZodJWT.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function jwt(params) {
  return _jwt(ZodJWT, params);
}
__name(jwt, "jwt");
var ZodCustomStringFormat = /* @__PURE__ */ $constructor("ZodCustomStringFormat", (inst, def2) => {
  $ZodCustomStringFormat.init(inst, def2);
  ZodStringFormat.init(inst, def2);
});
function stringFormat(format, fnOrRegex, _params = {}) {
  return _stringFormat(ZodCustomStringFormat, format, fnOrRegex, _params);
}
__name(stringFormat, "stringFormat");
function hostname2(_params) {
  return _stringFormat(ZodCustomStringFormat, "hostname", regexes_exports.hostname, _params);
}
__name(hostname2, "hostname");
function hex2(_params) {
  return _stringFormat(ZodCustomStringFormat, "hex", regexes_exports.hex, _params);
}
__name(hex2, "hex");
function hash(alg, params) {
  const enc = params?.enc ?? "hex";
  const format = `${alg}_${enc}`;
  const regex = regexes_exports[format];
  if (!regex)
    throw new Error(`Unrecognized hash format: ${format}`);
  return _stringFormat(ZodCustomStringFormat, format, regex, params);
}
__name(hash, "hash");
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def2) => {
  $ZodNumber.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => numberProcessor(inst, ctx, json2, params);
  _installLazyMethods(inst, "ZodNumber", {
    gt(value, params) {
      return this.check(_gt(value, params));
    },
    gte(value, params) {
      return this.check(_gte(value, params));
    },
    min(value, params) {
      return this.check(_gte(value, params));
    },
    lt(value, params) {
      return this.check(_lt(value, params));
    },
    lte(value, params) {
      return this.check(_lte(value, params));
    },
    max(value, params) {
      return this.check(_lte(value, params));
    },
    int(params) {
      return this.check(int(params));
    },
    safe(params) {
      return this.check(int(params));
    },
    positive(params) {
      return this.check(_gt(0, params));
    },
    nonnegative(params) {
      return this.check(_gte(0, params));
    },
    negative(params) {
      return this.check(_lt(0, params));
    },
    nonpositive(params) {
      return this.check(_lte(0, params));
    },
    multipleOf(value, params) {
      return this.check(_multipleOf(value, params));
    },
    step(value, params) {
      return this.check(_multipleOf(value, params));
    },
    finite() {
      return this;
    }
  });
  const bag = inst._zod.bag;
  inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
  inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
  inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
  inst.isFinite = true;
  inst.format = bag.format ?? null;
});
function number2(params) {
  return _number(ZodNumber, params);
}
__name(number2, "number");
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def2) => {
  $ZodNumberFormat.init(inst, def2);
  ZodNumber.init(inst, def2);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
__name(int, "int");
function float32(params) {
  return _float32(ZodNumberFormat, params);
}
__name(float32, "float32");
function float64(params) {
  return _float64(ZodNumberFormat, params);
}
__name(float64, "float64");
function int32(params) {
  return _int32(ZodNumberFormat, params);
}
__name(int32, "int32");
function uint32(params) {
  return _uint32(ZodNumberFormat, params);
}
__name(uint32, "uint32");
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def2) => {
  $ZodBoolean.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => booleanProcessor(inst, ctx, json2, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
__name(boolean2, "boolean");
var ZodBigInt = /* @__PURE__ */ $constructor("ZodBigInt", (inst, def2) => {
  $ZodBigInt.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => bigintProcessor(inst, ctx, json2, params);
  inst.gte = (value, params) => inst.check(_gte(value, params));
  inst.min = (value, params) => inst.check(_gte(value, params));
  inst.gt = (value, params) => inst.check(_gt(value, params));
  inst.gte = (value, params) => inst.check(_gte(value, params));
  inst.min = (value, params) => inst.check(_gte(value, params));
  inst.lt = (value, params) => inst.check(_lt(value, params));
  inst.lte = (value, params) => inst.check(_lte(value, params));
  inst.max = (value, params) => inst.check(_lte(value, params));
  inst.positive = (params) => inst.check(_gt(BigInt(0), params));
  inst.negative = (params) => inst.check(_lt(BigInt(0), params));
  inst.nonpositive = (params) => inst.check(_lte(BigInt(0), params));
  inst.nonnegative = (params) => inst.check(_gte(BigInt(0), params));
  inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
  const bag = inst._zod.bag;
  inst.minValue = bag.minimum ?? null;
  inst.maxValue = bag.maximum ?? null;
  inst.format = bag.format ?? null;
});
function bigint2(params) {
  return _bigint(ZodBigInt, params);
}
__name(bigint2, "bigint");
var ZodBigIntFormat = /* @__PURE__ */ $constructor("ZodBigIntFormat", (inst, def2) => {
  $ZodBigIntFormat.init(inst, def2);
  ZodBigInt.init(inst, def2);
});
function int64(params) {
  return _int64(ZodBigIntFormat, params);
}
__name(int64, "int64");
function uint64(params) {
  return _uint64(ZodBigIntFormat, params);
}
__name(uint64, "uint64");
var ZodSymbol = /* @__PURE__ */ $constructor("ZodSymbol", (inst, def2) => {
  $ZodSymbol.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => symbolProcessor(inst, ctx, json2, params);
});
function symbol(params) {
  return _symbol(ZodSymbol, params);
}
__name(symbol, "symbol");
var ZodUndefined = /* @__PURE__ */ $constructor("ZodUndefined", (inst, def2) => {
  $ZodUndefined.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => undefinedProcessor(inst, ctx, json2, params);
});
function _undefined3(params) {
  return _undefined2(ZodUndefined, params);
}
__name(_undefined3, "_undefined");
var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def2) => {
  $ZodNull.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullProcessor(inst, ctx, json2, params);
});
function _null3(params) {
  return _null2(ZodNull, params);
}
__name(_null3, "_null");
var ZodAny = /* @__PURE__ */ $constructor("ZodAny", (inst, def2) => {
  $ZodAny.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => anyProcessor(inst, ctx, json2, params);
});
function any() {
  return _any(ZodAny);
}
__name(any, "any");
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def2) => {
  $ZodUnknown.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => unknownProcessor(inst, ctx, json2, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
__name(unknown, "unknown");
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def2) => {
  $ZodNever.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => neverProcessor(inst, ctx, json2, params);
});
function never(params) {
  return _never(ZodNever, params);
}
__name(never, "never");
var ZodVoid = /* @__PURE__ */ $constructor("ZodVoid", (inst, def2) => {
  $ZodVoid.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => voidProcessor(inst, ctx, json2, params);
});
function _void2(params) {
  return _void(ZodVoid, params);
}
__name(_void2, "_void");
var ZodDate = /* @__PURE__ */ $constructor("ZodDate", (inst, def2) => {
  $ZodDate.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => dateProcessor(inst, ctx, json2, params);
  inst.min = (value, params) => inst.check(_gte(value, params));
  inst.max = (value, params) => inst.check(_lte(value, params));
  const c = inst._zod.bag;
  inst.minDate = c.minimum ? new Date(c.minimum) : null;
  inst.maxDate = c.maximum ? new Date(c.maximum) : null;
});
function date3(params) {
  return _date(ZodDate, params);
}
__name(date3, "date");
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def2) => {
  $ZodArray.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => arrayProcessor(inst, ctx, json2, params);
  inst.element = def2.element;
  _installLazyMethods(inst, "ZodArray", {
    min(n, params) {
      return this.check(_minLength(n, params));
    },
    nonempty(params) {
      return this.check(_minLength(1, params));
    },
    max(n, params) {
      return this.check(_maxLength(n, params));
    },
    length(n, params) {
      return this.check(_length(n, params));
    },
    unwrap() {
      return this.element;
    }
  });
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
__name(array, "array");
function keyof(schema) {
  const shape = schema._zod.def.shape;
  return _enum2(Object.keys(shape));
}
__name(keyof, "keyof");
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def2) => {
  $ZodObjectJIT.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => objectProcessor(inst, ctx, json2, params);
  util_exports.defineLazy(inst, "shape", () => {
    return def2.shape;
  });
  _installLazyMethods(inst, "ZodObject", {
    keyof() {
      return _enum2(Object.keys(this._zod.def.shape));
    },
    catchall(catchall) {
      return this.clone({ ...this._zod.def, catchall });
    },
    passthrough() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    loose() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    strict() {
      return this.clone({ ...this._zod.def, catchall: never() });
    },
    strip() {
      return this.clone({ ...this._zod.def, catchall: void 0 });
    },
    extend(incoming) {
      return util_exports.extend(this, incoming);
    },
    safeExtend(incoming) {
      return util_exports.safeExtend(this, incoming);
    },
    merge(other2) {
      return util_exports.merge(this, other2);
    },
    pick(mask) {
      return util_exports.pick(this, mask);
    },
    omit(mask) {
      return util_exports.omit(this, mask);
    },
    partial(...args) {
      return util_exports.partial(ZodOptional, this, args[0]);
    },
    required(...args) {
      return util_exports.required(ZodNonOptional, this, args[0]);
    }
  });
});
function object(shape, params) {
  const def2 = {
    type: "object",
    shape: shape ?? {},
    ...util_exports.normalizeParams(params)
  };
  return new ZodObject(def2);
}
__name(object, "object");
function strictObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: never(),
    ...util_exports.normalizeParams(params)
  });
}
__name(strictObject, "strictObject");
function looseObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: unknown(),
    ...util_exports.normalizeParams(params)
  });
}
__name(looseObject, "looseObject");
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def2) => {
  $ZodUnion.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
  inst.options = def2.options;
});
function union(options2, params) {
  return new ZodUnion({
    type: "union",
    options: options2,
    ...util_exports.normalizeParams(params)
  });
}
__name(union, "union");
var ZodXor = /* @__PURE__ */ $constructor("ZodXor", (inst, def2) => {
  ZodUnion.init(inst, def2);
  $ZodXor.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
  inst.options = def2.options;
});
function xor(options2, params) {
  return new ZodXor({
    type: "union",
    options: options2,
    inclusive: false,
    ...util_exports.normalizeParams(params)
  });
}
__name(xor, "xor");
var ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def2) => {
  ZodUnion.init(inst, def2);
  $ZodDiscriminatedUnion.init(inst, def2);
});
function discriminatedUnion(discriminator, options2, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options: options2,
    discriminator,
    ...util_exports.normalizeParams(params)
  });
}
__name(discriminatedUnion, "discriminatedUnion");
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def2) => {
  $ZodIntersection.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => intersectionProcessor(inst, ctx, json2, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
__name(intersection, "intersection");
var ZodTuple = /* @__PURE__ */ $constructor("ZodTuple", (inst, def2) => {
  $ZodTuple.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => tupleProcessor(inst, ctx, json2, params);
  inst.rest = (rest) => inst.clone({
    ...inst._zod.def,
    rest
  });
});
function tuple(items, _paramsOrRest, _params) {
  const hasRest = _paramsOrRest instanceof $ZodType;
  const params = hasRest ? _params : _paramsOrRest;
  const rest = hasRest ? _paramsOrRest : null;
  return new ZodTuple({
    type: "tuple",
    items,
    rest,
    ...util_exports.normalizeParams(params)
  });
}
__name(tuple, "tuple");
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def2) => {
  $ZodRecord.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => recordProcessor(inst, ctx, json2, params);
  inst.keyType = def2.keyType;
  inst.valueType = def2.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...util_exports.normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...util_exports.normalizeParams(params)
  });
}
__name(record, "record");
function partialRecord(keyType, valueType, params) {
  const k = clone(keyType);
  k._zod.values = void 0;
  return new ZodRecord({
    type: "record",
    keyType: k,
    valueType,
    ...util_exports.normalizeParams(params)
  });
}
__name(partialRecord, "partialRecord");
function looseRecord(keyType, valueType, params) {
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    mode: "loose",
    ...util_exports.normalizeParams(params)
  });
}
__name(looseRecord, "looseRecord");
var ZodMap = /* @__PURE__ */ $constructor("ZodMap", (inst, def2) => {
  $ZodMap.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => mapProcessor(inst, ctx, json2, params);
  inst.keyType = def2.keyType;
  inst.valueType = def2.valueType;
  inst.min = (...args) => inst.check(_minSize(...args));
  inst.nonempty = (params) => inst.check(_minSize(1, params));
  inst.max = (...args) => inst.check(_maxSize(...args));
  inst.size = (...args) => inst.check(_size(...args));
});
function map(keyType, valueType, params) {
  return new ZodMap({
    type: "map",
    keyType,
    valueType,
    ...util_exports.normalizeParams(params)
  });
}
__name(map, "map");
var ZodSet = /* @__PURE__ */ $constructor("ZodSet", (inst, def2) => {
  $ZodSet.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => setProcessor(inst, ctx, json2, params);
  inst.min = (...args) => inst.check(_minSize(...args));
  inst.nonempty = (params) => inst.check(_minSize(1, params));
  inst.max = (...args) => inst.check(_maxSize(...args));
  inst.size = (...args) => inst.check(_size(...args));
});
function set(valueType, params) {
  return new ZodSet({
    type: "set",
    valueType,
    ...util_exports.normalizeParams(params)
  });
}
__name(set, "set");
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def2) => {
  $ZodEnum.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => enumProcessor(inst, ctx, json2, params);
  inst.enum = def2.entries;
  inst.options = Object.values(def2.entries);
  const keys = new Set(Object.keys(def2.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def2.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def2,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def2.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def2,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum2(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...util_exports.normalizeParams(params)
  });
}
__name(_enum2, "_enum");
function nativeEnum(entries, params) {
  return new ZodEnum({
    type: "enum",
    entries,
    ...util_exports.normalizeParams(params)
  });
}
__name(nativeEnum, "nativeEnum");
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def2) => {
  $ZodLiteral.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => literalProcessor(inst, ctx, json2, params);
  inst.values = new Set(def2.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def2.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def2.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...util_exports.normalizeParams(params)
  });
}
__name(literal, "literal");
var ZodFile = /* @__PURE__ */ $constructor("ZodFile", (inst, def2) => {
  $ZodFile.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => fileProcessor(inst, ctx, json2, params);
  inst.min = (size, params) => inst.check(_minSize(size, params));
  inst.max = (size, params) => inst.check(_maxSize(size, params));
  inst.mime = (types, params) => inst.check(_mime(Array.isArray(types) ? types : [types], params));
});
function file(params) {
  return _file(ZodFile, params);
}
__name(file, "file");
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def2) => {
  $ZodTransform.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => transformProcessor(inst, ctx, json2, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(util_exports.issue(issue2, payload.value, def2));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(util_exports.issue(_issue));
      }
    };
    const output = def2.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    payload.value = output;
    payload.fallback = true;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
__name(transform, "transform");
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def2) => {
  $ZodOptional.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
__name(optional, "optional");
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def2) => {
  $ZodExactOptional.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
__name(exactOptional, "exactOptional");
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def2) => {
  $ZodNullable.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullableProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
__name(nullable, "nullable");
function nullish2(innerType) {
  return optional(nullable(innerType));
}
__name(nullish2, "nullish");
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def2) => {
  $ZodDefault.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => defaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default2(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
__name(_default2, "_default");
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def2) => {
  $ZodPrefault.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => prefaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
__name(prefault, "prefault");
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def2) => {
  $ZodNonOptional.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => nonoptionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...util_exports.normalizeParams(params)
  });
}
__name(nonoptional, "nonoptional");
var ZodSuccess = /* @__PURE__ */ $constructor("ZodSuccess", (inst, def2) => {
  $ZodSuccess.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => successProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function success(innerType) {
  return new ZodSuccess({
    type: "success",
    innerType
  });
}
__name(success, "success");
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def2) => {
  $ZodCatch.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => catchProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch2(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
__name(_catch2, "_catch");
var ZodNaN = /* @__PURE__ */ $constructor("ZodNaN", (inst, def2) => {
  $ZodNaN.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => nanProcessor(inst, ctx, json2, params);
});
function nan(params) {
  return _nan(ZodNaN, params);
}
__name(nan, "nan");
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def2) => {
  $ZodPipe.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => pipeProcessor(inst, ctx, json2, params);
  inst.in = def2.in;
  inst.out = def2.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
    // ...util.normalizeParams(params),
  });
}
__name(pipe, "pipe");
var ZodCodec = /* @__PURE__ */ $constructor("ZodCodec", (inst, def2) => {
  ZodPipe.init(inst, def2);
  $ZodCodec.init(inst, def2);
});
function codec(in_, out, params) {
  return new ZodCodec({
    type: "pipe",
    in: in_,
    out,
    transform: params.decode,
    reverseTransform: params.encode
  });
}
__name(codec, "codec");
function invertCodec(codec2) {
  const def2 = codec2._zod.def;
  return new ZodCodec({
    type: "pipe",
    in: def2.out,
    out: def2.in,
    transform: def2.reverseTransform,
    reverseTransform: def2.transform
  });
}
__name(invertCodec, "invertCodec");
var ZodPreprocess = /* @__PURE__ */ $constructor("ZodPreprocess", (inst, def2) => {
  ZodPipe.init(inst, def2);
  $ZodPreprocess.init(inst, def2);
});
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def2) => {
  $ZodReadonly.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => readonlyProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
__name(readonly, "readonly");
var ZodTemplateLiteral = /* @__PURE__ */ $constructor("ZodTemplateLiteral", (inst, def2) => {
  $ZodTemplateLiteral.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => templateLiteralProcessor(inst, ctx, json2, params);
});
function templateLiteral(parts, params) {
  return new ZodTemplateLiteral({
    type: "template_literal",
    parts,
    ...util_exports.normalizeParams(params)
  });
}
__name(templateLiteral, "templateLiteral");
var ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def2) => {
  $ZodLazy.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => lazyProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
  });
}
__name(lazy, "lazy");
var ZodPromise = /* @__PURE__ */ $constructor("ZodPromise", (inst, def2) => {
  $ZodPromise.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => promiseProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function promise(innerType) {
  return new ZodPromise({
    type: "promise",
    innerType
  });
}
__name(promise, "promise");
var ZodFunction = /* @__PURE__ */ $constructor("ZodFunction", (inst, def2) => {
  $ZodFunction.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => functionProcessor(inst, ctx, json2, params);
});
function _function(params) {
  return new ZodFunction({
    type: "function",
    input: Array.isArray(params?.input) ? tuple(params?.input) : params?.input ?? array(unknown()),
    output: params?.output ?? unknown()
  });
}
__name(_function, "_function");
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def2) => {
  $ZodCustom.init(inst, def2);
  ZodType.init(inst, def2);
  inst._zod.processJSONSchema = (ctx, json2, params) => customProcessor(inst, ctx, json2, params);
});
function check(fn) {
  const ch = new $ZodCheck({
    check: "custom"
    // ...util.normalizeParams(params),
  });
  ch._zod.check = fn;
  return ch;
}
__name(check, "check");
function custom(fn, _params) {
  return _custom(ZodCustom, fn ?? (() => true), _params);
}
__name(custom, "custom");
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
__name(refine, "refine");
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
__name(superRefine, "superRefine");
var describe2 = describe;
var meta2 = meta;
function _instanceof(cls, params = {}) {
  const inst = new ZodCustom({
    type: "custom",
    check: "custom",
    fn: /* @__PURE__ */ __name((data) => data instanceof cls, "fn"),
    abort: true,
    ...util_exports.normalizeParams(params)
  });
  inst._zod.bag.Class = cls;
  inst._zod.check = (payload) => {
    if (!(payload.value instanceof cls)) {
      payload.issues.push({
        code: "invalid_type",
        expected: cls.name,
        input: payload.value,
        inst,
        path: [...inst._zod.def.path ?? []]
      });
    }
  };
  return inst;
}
__name(_instanceof, "_instanceof");
var stringbool = /* @__PURE__ */ __name((...args) => _stringbool({
  Codec: ZodCodec,
  Boolean: ZodBoolean,
  String: ZodString
}, ...args), "stringbool");
function json(params) {
  const jsonSchema = lazy(() => {
    return union([string2(params), number2(), boolean2(), _null3(), array(jsonSchema), record(string2(), jsonSchema)]);
  });
  return jsonSchema;
}
__name(json, "json");
function preprocess(fn, schema) {
  return new ZodPreprocess({
    type: "pipe",
    in: transform(fn),
    out: schema
  });
}
__name(preprocess, "preprocess");

// node_modules/zod/v4/classic/compat.js
init_esm();
var ZodIssueCode = {
  invalid_type: "invalid_type",
  too_big: "too_big",
  too_small: "too_small",
  invalid_format: "invalid_format",
  not_multiple_of: "not_multiple_of",
  unrecognized_keys: "unrecognized_keys",
  invalid_union: "invalid_union",
  invalid_key: "invalid_key",
  invalid_element: "invalid_element",
  invalid_value: "invalid_value",
  custom: "custom"
};
function setErrorMap(map2) {
  config({
    customError: map2
  });
}
__name(setErrorMap, "setErrorMap");
function getErrorMap() {
  return config().customError;
}
__name(getErrorMap, "getErrorMap");
var ZodFirstPartyTypeKind;
/* @__PURE__ */ (function(ZodFirstPartyTypeKind2) {
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));

// node_modules/zod/v4/classic/from-json-schema.js
init_esm();
var z = {
  ...schemas_exports2,
  ...checks_exports2,
  iso: iso_exports
};
var RECOGNIZED_KEYS = /* @__PURE__ */ new Set([
  // Schema identification
  "$schema",
  "$ref",
  "$defs",
  "definitions",
  // Core schema keywords
  "$id",
  "id",
  "$comment",
  "$anchor",
  "$vocabulary",
  "$dynamicRef",
  "$dynamicAnchor",
  // Type
  "type",
  "enum",
  "const",
  // Composition
  "anyOf",
  "oneOf",
  "allOf",
  "not",
  // Object
  "properties",
  "required",
  "additionalProperties",
  "patternProperties",
  "propertyNames",
  "minProperties",
  "maxProperties",
  // Array
  "items",
  "prefixItems",
  "additionalItems",
  "minItems",
  "maxItems",
  "uniqueItems",
  "contains",
  "minContains",
  "maxContains",
  // String
  "minLength",
  "maxLength",
  "pattern",
  "format",
  // Number
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  // Already handled metadata
  "description",
  "default",
  // Content
  "contentEncoding",
  "contentMediaType",
  "contentSchema",
  // Unsupported (error-throwing)
  "unevaluatedItems",
  "unevaluatedProperties",
  "if",
  "then",
  "else",
  "dependentSchemas",
  "dependentRequired",
  // OpenAPI
  "nullable",
  "readOnly"
]);
function detectVersion(schema, defaultTarget) {
  const $schema = schema.$schema;
  if ($schema === "https://json-schema.org/draft/2020-12/schema") {
    return "draft-2020-12";
  }
  if ($schema === "http://json-schema.org/draft-07/schema#") {
    return "draft-7";
  }
  if ($schema === "http://json-schema.org/draft-04/schema#") {
    return "draft-4";
  }
  return defaultTarget ?? "draft-2020-12";
}
__name(detectVersion, "detectVersion");
function resolveRef(ref, ctx) {
  if (!ref.startsWith("#")) {
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  }
  const path = ref.slice(1).split("/").filter(Boolean);
  if (path.length === 0) {
    return ctx.rootSchema;
  }
  const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
  if (path[0] === defsKey) {
    const key = path[1];
    if (!key || !ctx.defs[key]) {
      throw new Error(`Reference not found: ${ref}`);
    }
    return ctx.defs[key];
  }
  throw new Error(`Reference not found: ${ref}`);
}
__name(resolveRef, "resolveRef");
function convertBaseSchema(schema, ctx) {
  if (schema.not !== void 0) {
    if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) {
      return z.never();
    }
    throw new Error("not is not supported in Zod (except { not: {} } for never)");
  }
  if (schema.unevaluatedItems !== void 0) {
    throw new Error("unevaluatedItems is not supported");
  }
  if (schema.unevaluatedProperties !== void 0) {
    throw new Error("unevaluatedProperties is not supported");
  }
  if (schema.if !== void 0 || schema.then !== void 0 || schema.else !== void 0) {
    throw new Error("Conditional schemas (if/then/else) are not supported");
  }
  if (schema.dependentSchemas !== void 0 || schema.dependentRequired !== void 0) {
    throw new Error("dependentSchemas and dependentRequired are not supported");
  }
  if (schema.$ref) {
    const refPath = schema.$ref;
    if (ctx.refs.has(refPath)) {
      return ctx.refs.get(refPath);
    }
    if (ctx.processing.has(refPath)) {
      return z.lazy(() => {
        if (!ctx.refs.has(refPath)) {
          throw new Error(`Circular reference not resolved: ${refPath}`);
        }
        return ctx.refs.get(refPath);
      });
    }
    ctx.processing.add(refPath);
    const resolved = resolveRef(refPath, ctx);
    const zodSchema2 = convertSchema(resolved, ctx);
    ctx.refs.set(refPath, zodSchema2);
    ctx.processing.delete(refPath);
    return zodSchema2;
  }
  if (schema.enum !== void 0) {
    const enumValues = schema.enum;
    if (ctx.version === "openapi-3.0" && schema.nullable === true && enumValues.length === 1 && enumValues[0] === null) {
      return z.null();
    }
    if (enumValues.length === 0) {
      return z.never();
    }
    if (enumValues.length === 1) {
      return z.literal(enumValues[0]);
    }
    if (enumValues.every((v) => typeof v === "string")) {
      return z.enum(enumValues);
    }
    const literalSchemas = enumValues.map((v) => z.literal(v));
    if (literalSchemas.length < 2) {
      return literalSchemas[0];
    }
    return z.union([literalSchemas[0], literalSchemas[1], ...literalSchemas.slice(2)]);
  }
  if (schema.const !== void 0) {
    return z.literal(schema.const);
  }
  const type = schema.type;
  if (Array.isArray(type)) {
    const typeSchemas = type.map((t) => {
      const typeSchema = { ...schema, type: t };
      return convertBaseSchema(typeSchema, ctx);
    });
    if (typeSchemas.length === 0) {
      return z.never();
    }
    if (typeSchemas.length === 1) {
      return typeSchemas[0];
    }
    return z.union(typeSchemas);
  }
  if (!type) {
    return z.any();
  }
  let zodSchema;
  switch (type) {
    case "string": {
      let stringSchema = z.string();
      if (schema.format) {
        const format = schema.format;
        if (format === "email") {
          stringSchema = stringSchema.check(z.email());
        } else if (format === "uri" || format === "uri-reference") {
          stringSchema = stringSchema.check(z.url());
        } else if (format === "uuid" || format === "guid") {
          stringSchema = stringSchema.check(z.uuid());
        } else if (format === "date-time") {
          stringSchema = stringSchema.check(z.iso.datetime());
        } else if (format === "date") {
          stringSchema = stringSchema.check(z.iso.date());
        } else if (format === "time") {
          stringSchema = stringSchema.check(z.iso.time());
        } else if (format === "duration") {
          stringSchema = stringSchema.check(z.iso.duration());
        } else if (format === "ipv4") {
          stringSchema = stringSchema.check(z.ipv4());
        } else if (format === "ipv6") {
          stringSchema = stringSchema.check(z.ipv6());
        } else if (format === "mac") {
          stringSchema = stringSchema.check(z.mac());
        } else if (format === "cidr") {
          stringSchema = stringSchema.check(z.cidrv4());
        } else if (format === "cidr-v6") {
          stringSchema = stringSchema.check(z.cidrv6());
        } else if (format === "base64") {
          stringSchema = stringSchema.check(z.base64());
        } else if (format === "base64url") {
          stringSchema = stringSchema.check(z.base64url());
        } else if (format === "e164") {
          stringSchema = stringSchema.check(z.e164());
        } else if (format === "jwt") {
          stringSchema = stringSchema.check(z.jwt());
        } else if (format === "emoji") {
          stringSchema = stringSchema.check(z.emoji());
        } else if (format === "nanoid") {
          stringSchema = stringSchema.check(z.nanoid());
        } else if (format === "cuid") {
          stringSchema = stringSchema.check(z.cuid());
        } else if (format === "cuid2") {
          stringSchema = stringSchema.check(z.cuid2());
        } else if (format === "ulid") {
          stringSchema = stringSchema.check(z.ulid());
        } else if (format === "xid") {
          stringSchema = stringSchema.check(z.xid());
        } else if (format === "ksuid") {
          stringSchema = stringSchema.check(z.ksuid());
        }
      }
      if (typeof schema.minLength === "number") {
        stringSchema = stringSchema.min(schema.minLength);
      }
      if (typeof schema.maxLength === "number") {
        stringSchema = stringSchema.max(schema.maxLength);
      }
      if (schema.pattern) {
        stringSchema = stringSchema.regex(new RegExp(schema.pattern));
      }
      zodSchema = stringSchema;
      break;
    }
    case "number":
    case "integer": {
      let numberSchema = type === "integer" ? z.number().int() : z.number();
      if (typeof schema.minimum === "number") {
        numberSchema = numberSchema.min(schema.minimum);
      }
      if (typeof schema.maximum === "number") {
        numberSchema = numberSchema.max(schema.maximum);
      }
      if (typeof schema.exclusiveMinimum === "number") {
        numberSchema = numberSchema.gt(schema.exclusiveMinimum);
      } else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") {
        numberSchema = numberSchema.gt(schema.minimum);
      }
      if (typeof schema.exclusiveMaximum === "number") {
        numberSchema = numberSchema.lt(schema.exclusiveMaximum);
      } else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") {
        numberSchema = numberSchema.lt(schema.maximum);
      }
      if (typeof schema.multipleOf === "number") {
        numberSchema = numberSchema.multipleOf(schema.multipleOf);
      }
      zodSchema = numberSchema;
      break;
    }
    case "boolean": {
      zodSchema = z.boolean();
      break;
    }
    case "null": {
      zodSchema = z.null();
      break;
    }
    case "object": {
      const shape = {};
      const properties = schema.properties || {};
      const requiredSet = new Set(schema.required || []);
      for (const [key, propSchema] of Object.entries(properties)) {
        const propZodSchema = convertSchema(propSchema, ctx);
        shape[key] = requiredSet.has(key) ? propZodSchema : propZodSchema.optional();
      }
      if (schema.propertyNames) {
        const keySchema = convertSchema(schema.propertyNames, ctx);
        const valueSchema = schema.additionalProperties && typeof schema.additionalProperties === "object" ? convertSchema(schema.additionalProperties, ctx) : z.any();
        if (Object.keys(shape).length === 0) {
          zodSchema = z.record(keySchema, valueSchema);
          break;
        }
        const objectSchema2 = z.object(shape).passthrough();
        const recordSchema = z.looseRecord(keySchema, valueSchema);
        zodSchema = z.intersection(objectSchema2, recordSchema);
        break;
      }
      if (schema.patternProperties) {
        const patternProps = schema.patternProperties;
        const patternKeys = Object.keys(patternProps);
        const looseRecords = [];
        for (const pattern of patternKeys) {
          const patternValue = convertSchema(patternProps[pattern], ctx);
          const keySchema = z.string().regex(new RegExp(pattern));
          looseRecords.push(z.looseRecord(keySchema, patternValue));
        }
        const schemasToIntersect = [];
        if (Object.keys(shape).length > 0) {
          schemasToIntersect.push(z.object(shape).passthrough());
        }
        schemasToIntersect.push(...looseRecords);
        if (schemasToIntersect.length === 0) {
          zodSchema = z.object({}).passthrough();
        } else if (schemasToIntersect.length === 1) {
          zodSchema = schemasToIntersect[0];
        } else {
          let result = z.intersection(schemasToIntersect[0], schemasToIntersect[1]);
          for (let i = 2; i < schemasToIntersect.length; i++) {
            result = z.intersection(result, schemasToIntersect[i]);
          }
          zodSchema = result;
        }
        break;
      }
      const objectSchema = z.object(shape);
      if (schema.additionalProperties === false) {
        zodSchema = objectSchema.strict();
      } else if (typeof schema.additionalProperties === "object") {
        zodSchema = objectSchema.catchall(convertSchema(schema.additionalProperties, ctx));
      } else {
        zodSchema = objectSchema.passthrough();
      }
      break;
    }
    case "array": {
      const prefixItems = schema.prefixItems;
      const items = schema.items;
      if (prefixItems && Array.isArray(prefixItems)) {
        const tupleItems = prefixItems.map((item) => convertSchema(item, ctx));
        const rest = items && typeof items === "object" && !Array.isArray(items) ? convertSchema(items, ctx) : void 0;
        if (rest) {
          zodSchema = z.tuple(tupleItems).rest(rest);
        } else {
          zodSchema = z.tuple(tupleItems);
        }
        if (typeof schema.minItems === "number") {
          zodSchema = zodSchema.check(z.minLength(schema.minItems));
        }
        if (typeof schema.maxItems === "number") {
          zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
        }
      } else if (Array.isArray(items)) {
        const tupleItems = items.map((item) => convertSchema(item, ctx));
        const rest = schema.additionalItems && typeof schema.additionalItems === "object" ? convertSchema(schema.additionalItems, ctx) : void 0;
        if (rest) {
          zodSchema = z.tuple(tupleItems).rest(rest);
        } else {
          zodSchema = z.tuple(tupleItems);
        }
        if (typeof schema.minItems === "number") {
          zodSchema = zodSchema.check(z.minLength(schema.minItems));
        }
        if (typeof schema.maxItems === "number") {
          zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
        }
      } else if (items !== void 0) {
        const element = convertSchema(items, ctx);
        let arraySchema = z.array(element);
        if (typeof schema.minItems === "number") {
          arraySchema = arraySchema.min(schema.minItems);
        }
        if (typeof schema.maxItems === "number") {
          arraySchema = arraySchema.max(schema.maxItems);
        }
        zodSchema = arraySchema;
      } else {
        zodSchema = z.array(z.any());
      }
      break;
    }
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
  return zodSchema;
}
__name(convertBaseSchema, "convertBaseSchema");
function convertSchema(schema, ctx) {
  if (typeof schema === "boolean") {
    return schema ? z.any() : z.never();
  }
  let baseSchema = convertBaseSchema(schema, ctx);
  const hasExplicitType = schema.type || schema.enum !== void 0 || schema.const !== void 0;
  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    const options2 = schema.anyOf.map((s) => convertSchema(s, ctx));
    const anyOfUnion = z.union(options2);
    baseSchema = hasExplicitType ? z.intersection(baseSchema, anyOfUnion) : anyOfUnion;
  }
  if (schema.oneOf && Array.isArray(schema.oneOf)) {
    const options2 = schema.oneOf.map((s) => convertSchema(s, ctx));
    const oneOfUnion = z.xor(options2);
    baseSchema = hasExplicitType ? z.intersection(baseSchema, oneOfUnion) : oneOfUnion;
  }
  if (schema.allOf && Array.isArray(schema.allOf)) {
    if (schema.allOf.length === 0) {
      baseSchema = hasExplicitType ? baseSchema : z.any();
    } else {
      let result = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
      const startIdx = hasExplicitType ? 0 : 1;
      for (let i = startIdx; i < schema.allOf.length; i++) {
        result = z.intersection(result, convertSchema(schema.allOf[i], ctx));
      }
      baseSchema = result;
    }
  }
  if (schema.nullable === true && ctx.version === "openapi-3.0") {
    baseSchema = z.nullable(baseSchema);
  }
  if (schema.readOnly === true) {
    baseSchema = z.readonly(baseSchema);
  }
  if (schema.default !== void 0) {
    baseSchema = baseSchema.default(schema.default);
  }
  const extraMeta = {};
  const coreMetadataKeys = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (const key of coreMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  const contentMetadataKeys = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (const key of contentMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  for (const key of Object.keys(schema)) {
    if (!RECOGNIZED_KEYS.has(key)) {
      extraMeta[key] = schema[key];
    }
  }
  if (Object.keys(extraMeta).length > 0) {
    ctx.registry.add(baseSchema, extraMeta);
  }
  if (schema.description) {
    baseSchema = baseSchema.describe(schema.description);
  }
  return baseSchema;
}
__name(convertSchema, "convertSchema");
function fromJSONSchema(schema, params) {
  if (typeof schema === "boolean") {
    return schema ? z.any() : z.never();
  }
  let normalized;
  try {
    normalized = JSON.parse(JSON.stringify(schema));
  } catch {
    throw new Error("fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas");
  }
  const version2 = detectVersion(normalized, params?.defaultTarget);
  const defs = normalized.$defs || normalized.definitions || {};
  const ctx = {
    version: version2,
    defs,
    refs: /* @__PURE__ */ new Map(),
    processing: /* @__PURE__ */ new Set(),
    rootSchema: normalized,
    registry: params?.registry ?? globalRegistry
  };
  return convertSchema(normalized, ctx);
}
__name(fromJSONSchema, "fromJSONSchema");

// node_modules/zod/v4/classic/coerce.js
var coerce_exports = {};
__export(coerce_exports, {
  bigint: () => bigint3,
  boolean: () => boolean3,
  date: () => date4,
  number: () => number3,
  string: () => string3
});
init_esm();
function string3(params) {
  return _coercedString(ZodString, params);
}
__name(string3, "string");
function number3(params) {
  return _coercedNumber(ZodNumber, params);
}
__name(number3, "number");
function boolean3(params) {
  return _coercedBoolean(ZodBoolean, params);
}
__name(boolean3, "boolean");
function bigint3(params) {
  return _coercedBigint(ZodBigInt, params);
}
__name(bigint3, "bigint");
function date4(params) {
  return _coercedDate(ZodDate, params);
}
__name(date4, "date");

// node_modules/zod/v4/classic/external.js
config(en_default());

// node_modules/zod/index.js
init_esm();

// node_modules/@liveblocks/core/dist/index.js
init_esm();
var __defProp = Object.defineProperty;
var __export2 = /* @__PURE__ */ __name((target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
}, "__export");
var PKG_NAME = "@liveblocks/core";
var PKG_VERSION = "3.19.3";
var PKG_FORMAT = "esm";
var g = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
var crossLinkedDocs = "https://liveblocks.io/docs/errors/cross-linked";
var dupesDocs = "https://liveblocks.io/docs/errors/dupes";
var SPACE = " ";
function error51(msg) {
  if (process.env.NODE_ENV === "production") {
    console.error(msg);
  } else {
    throw new Error(msg);
  }
}
__name(error51, "error");
function detectDupes(pkgName, pkgVersion, pkgFormat) {
  const pkgId = Symbol.for(pkgName);
  const pkgBuildInfo = pkgFormat ? `${pkgVersion || "dev"} (${pkgFormat})` : pkgVersion || "dev";
  if (!g[pkgId]) {
    g[pkgId] = pkgBuildInfo;
  } else if (g[pkgId] === pkgBuildInfo) {
  } else {
    const msg = [
      `Multiple copies of Liveblocks are being loaded in your project. This will cause issues! See ${dupesDocs + SPACE}`,
      "",
      "Conflicts:",
      `- ${pkgName} ${g[pkgId]} (already loaded)`,
      `- ${pkgName} ${pkgBuildInfo} (trying to load this now)`
    ].join("\n");
    error51(msg);
  }
  if (pkgVersion && PKG_VERSION && pkgVersion !== PKG_VERSION) {
    error51(
      [
        `Cross-linked versions of Liveblocks found, which will cause issues! See ${crossLinkedDocs + SPACE}`,
        "",
        "Conflicts:",
        `- ${PKG_NAME} is at ${PKG_VERSION}`,
        `- ${pkgName} is at ${pkgVersion}`,
        "",
        "Always upgrade all Liveblocks packages to the same version number."
      ].join("\n")
    );
  }
}
__name(detectDupes, "detectDupes");
function makeEventSource() {
  const _observers = /* @__PURE__ */ new Set();
  function subscribe(callback) {
    _observers.add(callback);
    return () => _observers.delete(callback);
  }
  __name(subscribe, "subscribe");
  function subscribeOnce(callback) {
    const unsub = subscribe((event) => {
      unsub();
      return callback(event);
    });
    return unsub;
  }
  __name(subscribeOnce, "subscribeOnce");
  async function waitUntil(predicate) {
    let unsub;
    return new Promise((res) => {
      unsub = subscribe((event) => {
        if (predicate === void 0 || predicate(event)) {
          res(event);
        }
      });
    }).finally(() => unsub?.());
  }
  __name(waitUntil, "waitUntil");
  function notify(event) {
    let called = false;
    for (const callback of _observers) {
      callback(event);
      called = true;
    }
    return called;
  }
  __name(notify, "notify");
  function count() {
    return _observers.size;
  }
  __name(count, "count");
  return {
    // Private/internal control over event emission
    notify,
    subscribe,
    subscribeOnce,
    count,
    waitUntil,
    dispose() {
      _observers.clear();
    },
    // Publicly exposable subscription API
    observable: {
      subscribe,
      subscribeOnce,
      waitUntil
    }
  };
}
__name(makeEventSource, "makeEventSource");
var freeze = process.env.NODE_ENV === "production" ? (
  /* istanbul ignore next */
  (x) => x
) : Object.freeze;
function raise(msg) {
  throw new Error(msg);
}
__name(raise, "raise");
function create(obj, descriptors) {
  if (typeof descriptors !== "undefined") {
    return Object.create(obj, descriptors);
  }
  return Object.create(obj);
}
__name(create, "create");
function tryParseJson(rawMessage) {
  try {
    return JSON.parse(rawMessage);
  } catch {
    return void 0;
  }
}
__name(tryParseJson, "tryParseJson");
function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
__name(deepClone, "deepClone");
function compactObject(obj) {
  const newObj = { ...obj };
  Object.keys(obj).forEach((k) => {
    const key = k;
    if (newObj[key] === void 0) {
      delete newObj[key];
    }
  });
  return newObj;
}
__name(compactObject, "compactObject");
var kSinks = /* @__PURE__ */ Symbol("kSinks");
var kTrigger = /* @__PURE__ */ Symbol("kTrigger");
var signalsToTrigger = null;
var trackedReads = null;
function enqueueTrigger(signal) {
  if (!signalsToTrigger) raise("Expected to be in an active batch");
  signalsToTrigger.add(signal);
}
__name(enqueueTrigger, "enqueueTrigger");
var AbstractSignal = class {
  static {
    __name(this, "AbstractSignal");
  }
  /** @internal */
  equals;
  #eventSource;
  /** @internal */
  [kSinks];
  constructor(equals) {
    this.equals = equals ?? Object.is;
    this.#eventSource = makeEventSource();
    this[kSinks] = /* @__PURE__ */ new Set();
    this.get = this.get.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.subscribeOnce = this.subscribeOnce.bind(this);
  }
  dispose() {
    this.#eventSource.dispose();
    this.#eventSource = "(disposed)";
    this.equals = "(disposed)";
  }
  get hasWatchers() {
    if (this.#eventSource.count() > 0) return true;
    for (const sink of this[kSinks]) {
      if (sink.hasWatchers) {
        return true;
      }
    }
    return false;
  }
  [kTrigger]() {
    this.#eventSource.notify();
    for (const sink of this[kSinks]) {
      enqueueTrigger(sink);
    }
  }
  subscribe(callback) {
    if (this.#eventSource.count() === 0) {
      this.get();
    }
    return this.#eventSource.subscribe(callback);
  }
  subscribeOnce(callback) {
    const unsub = this.subscribe(() => {
      unsub();
      return callback();
    });
    return unsub;
  }
  waitUntil() {
    throw new Error("waitUntil not supported on Signals");
  }
  markSinksDirty() {
    for (const sink of this[kSinks]) {
      sink.markDirty();
    }
  }
  addSink(sink) {
    this[kSinks].add(sink);
  }
  removeSink(sink) {
    this[kSinks].delete(sink);
  }
  asReadonly() {
    return this;
  }
};
var INITIAL = /* @__PURE__ */ Symbol();
var DerivedSignal = class _DerivedSignal extends AbstractSignal {
  static {
    __name(this, "_DerivedSignal");
  }
  #prevValue;
  #dirty;
  // When true, the value in #value may not be up-to-date and needs re-checking
  #sources;
  #deps;
  #transform;
  // prettier-ignore
  static from(...args) {
    const last = args.pop();
    if (typeof last !== "function")
      raise("Invalid .from() call, last argument expected to be a function");
    if (typeof args[args.length - 1] === "function") {
      const equals = last;
      const transform2 = args.pop();
      return new _DerivedSignal(args, transform2, equals);
    } else {
      const transform2 = last;
      return new _DerivedSignal(args, transform2);
    }
  }
  constructor(deps, transform2, equals) {
    super(equals);
    this.#dirty = true;
    this.#prevValue = INITIAL;
    this.#deps = deps;
    this.#sources = /* @__PURE__ */ new Set();
    this.#transform = transform2;
  }
  dispose() {
    for (const src of this.#sources) {
      src.removeSink(this);
    }
    this.#prevValue = "(disposed)";
    this.#sources = "(disposed)";
    this.#deps = "(disposed)";
    this.#transform = "(disposed)";
  }
  get isDirty() {
    return this.#dirty;
  }
  #recompute() {
    const oldTrackedReads = trackedReads;
    let derived;
    trackedReads = /* @__PURE__ */ new Set();
    try {
      derived = this.#transform(...this.#deps.map((p) => p.get()));
    } finally {
      const oldSources = this.#sources;
      this.#sources = /* @__PURE__ */ new Set();
      for (const sig of trackedReads) {
        this.#sources.add(sig);
        oldSources.delete(sig);
      }
      for (const oldSource of oldSources) {
        oldSource.removeSink(this);
      }
      for (const newSource of this.#sources) {
        newSource.addSink(this);
      }
      trackedReads = oldTrackedReads;
    }
    this.#dirty = false;
    if (!this.equals(this.#prevValue, derived)) {
      this.#prevValue = derived;
      return true;
    }
    return false;
  }
  markDirty() {
    if (!this.#dirty) {
      this.#dirty = true;
      this.markSinksDirty();
    }
  }
  get() {
    if (this.#dirty) {
      this.#recompute();
    }
    trackedReads?.add(this);
    return this.#prevValue;
  }
  /**
   * Called by the Signal system if one or more of the dependent signals have
   * changed. In the case of a DerivedSignal, we'll only want to re-evaluate
   * the actual value if it's being watched, or any of their sinks are being
   * watched actively.
   */
  [kTrigger]() {
    if (!this.hasWatchers) {
      return;
    }
    const updated = this.#recompute();
    if (updated) {
      super[kTrigger]();
    }
  }
};
function bisectRight(arr, x, lt) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = lo + (hi - lo >> 1);
    if (lt(x, arr[mid])) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}
__name(bisectRight, "bisectRight");
var SortedList = class _SortedList {
  static {
    __name(this, "_SortedList");
  }
  #data;
  #lt;
  constructor(alreadySortedList, lt) {
    this.#lt = lt;
    this.#data = alreadySortedList;
  }
  /**
   * Creates an empty SortedList with the given "less than" function.
   */
  static with(lt) {
    return _SortedList.fromAlreadySorted([], lt);
  }
  static from(arr, lt) {
    const sorted = new _SortedList([], lt);
    for (const item of arr) {
      sorted.add(item);
    }
    return sorted;
  }
  static fromAlreadySorted(alreadySorted, lt) {
    return new _SortedList(alreadySorted, lt);
  }
  /**
   * Clones the sorted list to a new instance.
   */
  clone() {
    return new _SortedList(this.#data.slice(), this.#lt);
  }
  /**
   * Adds a new item to the sorted list, such that it remains sorted.
   * Returns the index where the item was inserted.
   */
  add(value) {
    const idx = bisectRight(this.#data, value, this.#lt);
    this.#data.splice(idx, 0, value);
    return idx;
  }
  /**
   * Removes all values from the sorted list, making it empty again.
   * Returns whether the list was mutated or not.
   */
  clear() {
    const hadData = this.#data.length > 0;
    this.#data.length = 0;
    return hadData;
  }
  /**
   * Removes the first value matching the predicate.
   * Returns whether the list was mutated or not.
   */
  removeBy(predicate, limit = Number.POSITIVE_INFINITY) {
    let deleted = 0;
    for (let i = 0; i < this.#data.length; i++) {
      if (predicate(this.#data[i])) {
        this.#data.splice(i, 1);
        deleted++;
        if (deleted >= limit) {
          break;
        } else {
          i--;
        }
      }
    }
    return deleted > 0;
  }
  /**
   * Removes the given value from the sorted list, if it exists. The given
   * value must be `===` to one of the list items. Only the first entry will be
   * removed if the element exists in the sorted list multiple times.
   *
   * Returns whether the list was mutated or not.
   */
  remove(value) {
    const idx = this.#data.indexOf(value);
    if (idx >= 0) {
      this.#data.splice(idx, 1);
      return true;
    }
    return false;
  }
  /**
   * Removes the item at the given index.
   * Returns the removed item, or undefined if index is out of bounds.
   */
  removeAt(index) {
    if (index < 0 || index >= this.#data.length) {
      return void 0;
    }
    const [removed] = this.#data.splice(index, 1);
    return removed;
  }
  /**
   * Repositions an item to maintain sorted order after its sort key has
   * been mutated in-place. For example:
   *
   *   const item = sorted.at(3);
   *   item.updatedAt = new Date();  // mutate the item's sort key in-place
   *   sorted.reposition(item);      // restore sorted order
   *
   * Returns the new index of the item. Throws if the item is not in the list.
   *
   * Semantically equivalent to remove(value) + add(value), but optimized
   * to avoid array shifting when the item only moves a short distance.
   */
  reposition(value) {
    const oldIdx = this.#data.indexOf(value);
    if (oldIdx < 0) {
      throw new Error("Cannot reposition item that is not in the list");
    }
    const prev = this.#data[oldIdx - 1];
    const next = this.#data[oldIdx + 1];
    const validLeft = prev === void 0 || this.#lt(prev, value);
    const validRight = next === void 0 || this.#lt(value, next);
    if (validLeft && validRight) {
      return oldIdx;
    }
    let newIdx = oldIdx;
    while (newIdx > 0 && this.#lt(value, this.#data[newIdx - 1])) {
      this.#data[newIdx] = this.#data[newIdx - 1];
      newIdx--;
    }
    if (newIdx < oldIdx) {
      this.#data[newIdx] = value;
      return newIdx;
    }
    while (newIdx < this.#data.length - 1 && !this.#lt(value, this.#data[newIdx + 1])) {
      this.#data[newIdx] = this.#data[newIdx + 1];
      newIdx++;
    }
    if (newIdx !== oldIdx) {
      this.#data[newIdx] = value;
    }
    return newIdx;
  }
  at(index) {
    return this.#data[index];
  }
  get length() {
    return this.#data.length;
  }
  *filter(predicate) {
    for (const item of this.#data) {
      if (predicate(item)) {
        yield item;
      }
    }
  }
  // XXXX If we keep this, add unit tests. Or remove it.
  *findAllRight(predicate) {
    for (let i = this.#data.length - 1; i >= 0; i--) {
      const item = this.#data[i];
      if (predicate(item, i)) {
        yield item;
      }
    }
  }
  [Symbol.iterator]() {
    return this.#data[Symbol.iterator]();
  }
  *iterReversed() {
    for (let i = this.#data.length - 1; i >= 0; i--) {
      yield this.#data[i];
    }
  }
  /** Finds the leftmost item that matches the predicate. */
  find(predicate, start) {
    const idx = this.findIndex(predicate, start);
    return idx > -1 ? this.#data.at(idx) : void 0;
  }
  /** Finds the leftmost index that matches the predicate. */
  findIndex(predicate, start = 0) {
    for (let i = Math.max(0, start); i < this.#data.length; i++) {
      if (predicate(this.#data[i], i)) {
        return i;
      }
    }
    return -1;
  }
  /** Finds the rightmost item that matches the predicate. */
  findRight(predicate, start) {
    const idx = this.findIndexRight(predicate, start);
    return idx > -1 ? this.#data.at(idx) : void 0;
  }
  /** Finds the rightmost index that matches the predicate. */
  findIndexRight(predicate, start = this.#data.length - 1) {
    for (let i = Math.min(start, this.#data.length - 1); i >= 0; i--) {
      if (predicate(this.#data[i], i)) {
        return i;
      }
    }
    return -1;
  }
  get rawArray() {
    return this.#data;
  }
};
function convertToCommentData(data) {
  const editedAt = data.editedAt ? new Date(data.editedAt) : void 0;
  const createdAt = new Date(data.createdAt);
  const reactions = data.reactions.map((reaction) => ({
    ...reaction,
    createdAt: new Date(reaction.createdAt)
  }));
  if (data.body) {
    return {
      ...data,
      reactions,
      createdAt,
      editedAt
    };
  } else {
    const deletedAt = new Date(data.deletedAt);
    return {
      ...data,
      reactions,
      createdAt,
      editedAt,
      deletedAt
    };
  }
}
__name(convertToCommentData, "convertToCommentData");
function convertToThreadData(data) {
  const createdAt = new Date(data.createdAt);
  const updatedAt = new Date(data.updatedAt);
  const comments = data.comments.map(
    (comment) => convertToCommentData(comment)
  );
  return {
    ...data,
    createdAt,
    updatedAt,
    comments
  };
}
__name(convertToThreadData, "convertToThreadData");
function convertToCommentUserReaction(data) {
  return {
    ...data,
    createdAt: new Date(data.createdAt)
  };
}
__name(convertToCommentUserReaction, "convertToCommentUserReaction");
function convertToInboxNotificationData(data) {
  const notifiedAt = new Date(data.notifiedAt);
  const readAt = data.readAt ? new Date(data.readAt) : null;
  if ("activities" in data) {
    const activities = data.activities.map((activity) => ({
      ...activity,
      createdAt: new Date(activity.createdAt)
    }));
    return {
      ...data,
      notifiedAt,
      readAt,
      activities
    };
  }
  return {
    ...data,
    notifiedAt,
    readAt
  };
}
__name(convertToInboxNotificationData, "convertToInboxNotificationData");
function convertToSubscriptionData(data) {
  const createdAt = new Date(data.createdAt);
  return {
    ...data,
    createdAt
  };
}
__name(convertToSubscriptionData, "convertToSubscriptionData");
function convertToUserSubscriptionData(data) {
  const createdAt = new Date(data.createdAt);
  return {
    ...data,
    createdAt
  };
}
__name(convertToUserSubscriptionData, "convertToUserSubscriptionData");
function convertToGroupData(data) {
  const createdAt = new Date(data.createdAt);
  const updatedAt = new Date(data.updatedAt);
  const members = data.members.map((member) => ({
    ...member,
    addedAt: new Date(member.addedAt)
  }));
  return {
    ...data,
    createdAt,
    updatedAt,
    members
  };
}
__name(convertToGroupData, "convertToGroupData");
function assertNever2(_value, errmsg) {
  throw new Error(errmsg);
}
__name(assertNever2, "assertNever");
function assert2(condition, errmsg) {
  if (process.env.NODE_ENV !== "production") {
    if (!condition) {
      const err = new Error(errmsg);
      err.name = "Assertion failure";
      throw err;
    }
  }
}
__name(assert2, "assert");
function nn(value, errmsg = "Expected value to be non-nullable") {
  assert2(value !== null && value !== void 0, errmsg);
  return value;
}
__name(nn, "nn");
var fancy_console_exports = {};
__export2(fancy_console_exports, {
  error: /* @__PURE__ */ __name(() => error210, "error"),
  errorWithTitle: /* @__PURE__ */ __name(() => errorWithTitle, "errorWithTitle"),
  warn: /* @__PURE__ */ __name(() => warn, "warn"),
  warnWithTitle: /* @__PURE__ */ __name(() => warnWithTitle, "warnWithTitle")
});
var badge = "background:#0e0d12;border-radius:9999px;color:#fff;padding:3px 7px;font-family:sans-serif;font-weight:600;";
var bold = "font-weight:600";
function wrap(method) {
  return typeof window === "undefined" || process.env.NODE_ENV === "test" ? console[method] : (
    /* istanbul ignore next */
    (message, ...args) => console[method]("%cLiveblocks", badge, message, ...args)
  );
}
__name(wrap, "wrap");
var warn = wrap("warn");
var error210 = wrap("error");
function wrapWithTitle(method) {
  return typeof window === "undefined" || process.env.NODE_ENV === "test" ? console[method] : (
    /* istanbul ignore next */
    (title, message, ...args) => console[method](
      `%cLiveblocks%c ${title}`,
      badge,
      bold,
      message,
      ...args
    )
  );
}
__name(wrapWithTitle, "wrapWithTitle");
var warnWithTitle = wrapWithTitle("warn");
var errorWithTitle = wrapWithTitle("error");
function isPlainObject2(blob) {
  return blob !== null && typeof blob === "object" && Object.prototype.toString.call(blob) === "[object Object]";
}
__name(isPlainObject2, "isPlainObject");
function isStartsWithOperator(blob) {
  return isPlainObject2(blob) && typeof blob.startsWith === "string";
}
__name(isStartsWithOperator, "isStartsWithOperator");
function isNumberOperator(blob) {
  return isPlainObject2(blob) && (typeof blob.lt === "number" || typeof blob.gt === "number" || typeof blob.lte === "number" || typeof blob.gte === "number");
}
__name(isNumberOperator, "isNumberOperator");
var nanoid3 = /* @__PURE__ */ __name((t = 21) => crypto.getRandomValues(new Uint8Array(t)).reduce(
  (t2, e) => t2 += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e < 63 ? "_" : "-",
  ""
), "nanoid");
var identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
function objectToQuery(obj) {
  let filterList = [];
  const entries2 = Object.entries(obj);
  const keyValuePairs = [];
  const keyValuePairsWithOperator = [];
  const indexedKeys = [];
  entries2.forEach(([key, value]) => {
    if (!identifierRegex.test(key)) {
      throw new Error("Key must only contain letters, numbers, _");
    }
    if (isSimpleValue(value)) {
      keyValuePairs.push([key, value]);
    } else if (isPlainObject2(value)) {
      if (isStartsWithOperator(value) || isNumberOperator(value)) {
        keyValuePairsWithOperator.push([key, value]);
      } else {
        indexedKeys.push([key, value]);
      }
    }
  });
  filterList = [
    ...getFiltersFromKeyValuePairs(keyValuePairs),
    ...getFiltersFromKeyValuePairsWithOperator(keyValuePairsWithOperator)
  ];
  indexedKeys.forEach(([key, value]) => {
    const nestedEntries = Object.entries(value);
    const nKeyValuePairs = [];
    const nKeyValuePairsWithOperator = [];
    nestedEntries.forEach(([nestedKey, nestedValue]) => {
      if (isStringEmpty(nestedKey)) {
        throw new Error("Key cannot be empty");
      }
      if (isSimpleValue(nestedValue)) {
        nKeyValuePairs.push([formatFilterKey(key, nestedKey), nestedValue]);
      } else if (isStartsWithOperator(nestedValue) || isNumberOperator(nestedValue)) {
        nKeyValuePairsWithOperator.push([
          formatFilterKey(key, nestedKey),
          nestedValue
        ]);
      }
    });
    filterList = [
      ...filterList,
      ...getFiltersFromKeyValuePairs(nKeyValuePairs),
      ...getFiltersFromKeyValuePairsWithOperator(nKeyValuePairsWithOperator)
    ];
  });
  return filterList.map(({ key, operator, value }) => `${key}${operator}${quote(value)}`).join(" ");
}
__name(objectToQuery, "objectToQuery");
var getFiltersFromKeyValuePairs = /* @__PURE__ */ __name((keyValuePairs) => {
  const filters = [];
  keyValuePairs.forEach(([key, value]) => {
    filters.push({
      key,
      operator: ":",
      value
    });
  });
  return filters;
}, "getFiltersFromKeyValuePairs");
var getFiltersFromKeyValuePairsWithOperator = /* @__PURE__ */ __name((keyValuePairsWithOperator) => {
  const filters = [];
  keyValuePairsWithOperator.forEach(([key, value]) => {
    if ("startsWith" in value && typeof value.startsWith === "string") {
      filters.push({
        key,
        operator: "^",
        value: value.startsWith
      });
    }
    if ("lt" in value && typeof value.lt === "number") {
      filters.push({
        key,
        operator: "<",
        value: value.lt
      });
    }
    if ("gt" in value && typeof value.gt === "number") {
      filters.push({
        key,
        operator: ">",
        value: value.gt
      });
    }
    if ("gte" in value && typeof value.gte === "number") {
      filters.push({
        key,
        operator: ">=",
        value: value.gte
      });
    }
    if ("lte" in value && typeof value.lte === "number") {
      filters.push({
        key,
        operator: "<=",
        value: value.lte
      });
    }
  });
  return filters;
}, "getFiltersFromKeyValuePairsWithOperator");
var isSimpleValue = /* @__PURE__ */ __name((value) => {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null;
}, "isSimpleValue");
var formatFilterKey = /* @__PURE__ */ __name((key, nestedKey) => {
  if (nestedKey) {
    return `${key}[${quote(nestedKey)}]`;
  }
  return key;
}, "formatFilterKey");
var isStringEmpty = /* @__PURE__ */ __name((value) => {
  return !value || value.toString().trim() === "";
}, "isStringEmpty");
function quote(input) {
  const result = JSON.stringify(input);
  if (typeof input !== "string") {
    return result;
  }
  if (result.includes("'")) {
    return result;
  }
  return `'${result.slice(1, -1).replace(/\\"/g, '"')}'`;
}
__name(quote, "quote");
function toURLSearchParams(params) {
  const result = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== void 0 && value !== null) {
      result.set(key, value.toString());
    }
  }
  return result;
}
__name(toURLSearchParams, "toURLSearchParams");
function urljoin(baseUrl, path, params) {
  const url22 = new URL(path, baseUrl);
  if (params !== void 0) {
    url22.search = (params instanceof URLSearchParams ? params : toURLSearchParams(params)).toString();
  }
  return url22.toString();
}
__name(urljoin, "urljoin");
function url2(strings, ...values2) {
  return strings.reduce(
    (result, str, i) => result + encodeURIComponent(values2[i - 1] ?? "") + str
  );
}
__name(url2, "url");
var ServerMsgCode = Object.freeze({
  // For Presence
  UPDATE_PRESENCE: 100,
  USER_JOINED: 101,
  USER_LEFT: 102,
  BROADCASTED_EVENT: 103,
  ROOM_STATE: 104,
  // For Storage
  STORAGE_STATE_V7: 200,
  // Only sent in V7
  STORAGE_CHUNK: 210,
  // Used in V8+
  STORAGE_STREAM_END: 211,
  // Used in V8+
  UPDATE_STORAGE: 201,
  // For Yjs Docs
  UPDATE_YDOC: 300,
  // For Comments
  THREAD_CREATED: 400,
  THREAD_DELETED: 407,
  THREAD_METADATA_UPDATED: 401,
  THREAD_UPDATED: 408,
  COMMENT_CREATED: 402,
  COMMENT_EDITED: 403,
  COMMENT_DELETED: 404,
  COMMENT_REACTION_ADDED: 405,
  COMMENT_REACTION_REMOVED: 406,
  COMMENT_METADATA_UPDATED: 409,
  // For Feeds
  FEEDS_LIST: 500,
  FEEDS_ADDED: 501,
  FEEDS_UPDATED: 502,
  FEED_DELETED: 503,
  FEED_MESSAGES_LIST: 504,
  FEED_MESSAGES_ADDED: 505,
  FEED_MESSAGES_UPDATED: 506,
  FEED_MESSAGES_DELETED: 507,
  FEED_REQUEST_FAILED: 508,
  // Error codes
  REJECT_STORAGE_OP: 299
  // Sent if a mutation was not allowed on the server (i.e. due to permissions, limit exceeded, etc)
});
var BACKOFF_DELAYS = [250, 500, 1e3, 2e3, 4e3, 8e3, 1e4];
var RESET_DELAY = BACKOFF_DELAYS[0] - 1;
function log(level, message) {
  const logger = level === 2 ? error210 : level === 1 ? warn : (
    /* black hole */
    () => {
    }
  );
  return () => {
    logger(message);
  };
}
__name(log, "log");
var logPermanentClose = log(
  1,
  "Connection to WebSocket closed permanently. Won't retry."
);
var EMPTY_OBJECT = Object.freeze({});
var NULL_KEYWORD_CHARS = Array.from(new Set("null"));
var TRUE_KEYWORD_CHARS = Array.from(new Set("true"));
var FALSE_KEYWORD_CHARS = Array.from(new Set("false"));
var ALL_KEYWORD_CHARS = Array.from(new Set("nulltruefalse"));
var OpCode = Object.freeze({
  INIT: 0,
  SET_PARENT_KEY: 1,
  CREATE_LIST: 2,
  UPDATE_OBJECT: 3,
  CREATE_OBJECT: 4,
  DELETE_CRDT: 5,
  DELETE_OBJECT_KEY: 6,
  CREATE_MAP: 7,
  CREATE_REGISTER: 8
});
var CrdtType = Object.freeze({
  OBJECT: 0,
  LIST: 1,
  MAP: 2,
  REGISTER: 3
});
function isRootStorageNode(node) {
  return node[0] === "root";
}
__name(isRootStorageNode, "isRootStorageNode");
function isObjectStorageNode(node) {
  return node[1].type === CrdtType.OBJECT;
}
__name(isObjectStorageNode, "isObjectStorageNode");
function isListStorageNode(node) {
  return node[1].type === CrdtType.LIST;
}
__name(isListStorageNode, "isListStorageNode");
function isMapStorageNode(node) {
  return node[1].type === CrdtType.MAP;
}
__name(isMapStorageNode, "isMapStorageNode");
function isRegisterStorageNode(node) {
  return node[1].type === CrdtType.REGISTER;
}
__name(isRegisterStorageNode, "isRegisterStorageNode");
var MIN_CODE = 32;
var MAX_CODE = 126;
var NUM_DIGITS = MAX_CODE - MIN_CODE + 1;
var ZERO = nthDigit(0);
var ONE = nthDigit(1);
var ZERO_NINE = ZERO + nthDigit(-1);
function nthDigit(n) {
  const code = MIN_CODE + (n < 0 ? NUM_DIGITS + n : n);
  if (code < MIN_CODE || code > MAX_CODE) {
    throw new Error(`Invalid n value: ${n}`);
  }
  return String.fromCharCode(code);
}
__name(nthDigit, "nthDigit");
function makePosition(x, y) {
  if (x !== void 0 && y !== void 0) {
    return between(x, y);
  } else if (x !== void 0) {
    return after(x);
  } else if (y !== void 0) {
    return before(y);
  } else {
    return ONE;
  }
}
__name(makePosition, "makePosition");
function before(pos) {
  const lastIndex = pos.length - 1;
  for (let i = 0; i <= lastIndex; i++) {
    const code = pos.charCodeAt(i);
    if (code <= MIN_CODE) {
      continue;
    }
    if (i === lastIndex) {
      if (code === MIN_CODE + 1) {
        return pos.substring(0, i) + ZERO_NINE;
      } else {
        return pos.substring(0, i) + String.fromCharCode(code - 1);
      }
    } else {
      return pos.substring(0, i + 1);
    }
  }
  return ONE;
}
__name(before, "before");
var VIEWPORT_START = 2;
var VIEWPORT_STEP = 3;
function after(pos) {
  for (let i = 0; i < pos.length; i++) {
    const code = pos.charCodeAt(i);
    if (code < MIN_CODE || code > MAX_CODE) {
      return pos + ONE;
    }
  }
  while (pos.length > 1 && pos.charCodeAt(pos.length - 1) === MIN_CODE) {
    pos = pos.slice(0, -1);
  }
  if (pos.length === 0 || pos === ZERO) {
    return ONE;
  }
  let viewport = VIEWPORT_START;
  if (pos.length > VIEWPORT_START) {
    viewport = VIEWPORT_START + Math.ceil((pos.length - VIEWPORT_START) / VIEWPORT_STEP) * VIEWPORT_STEP;
  }
  const result = incrementWithinViewport(pos, viewport);
  if (result !== null) {
    return result;
  }
  viewport += VIEWPORT_STEP;
  const extendedResult = incrementWithinViewport(pos, viewport);
  if (extendedResult !== null) {
    return extendedResult;
  }
  return pos + ONE;
}
__name(after, "after");
function incrementWithinViewport(pos, viewport) {
  const digits = [];
  for (let i = 0; i < viewport; i++) {
    if (i < pos.length) {
      digits.push(pos.charCodeAt(i) - MIN_CODE);
    } else {
      digits.push(0);
    }
  }
  let carry = 1;
  for (let i = viewport - 1; i >= 0 && carry; i--) {
    const sum = digits[i] + carry;
    if (sum >= NUM_DIGITS) {
      digits[i] = 0;
      carry = 1;
    } else {
      digits[i] = sum;
      carry = 0;
    }
  }
  if (carry) {
    return null;
  }
  let result = "";
  for (const d of digits) {
    result += String.fromCharCode(d + MIN_CODE);
  }
  while (result.length > 1 && result.charCodeAt(result.length - 1) === MIN_CODE) {
    result = result.slice(0, -1);
  }
  return result;
}
__name(incrementWithinViewport, "incrementWithinViewport");
function between(lo, hi) {
  if (lo < hi) {
    return _between(lo, hi);
  } else if (lo > hi) {
    return _between(hi, lo);
  } else {
    throw new Error("Cannot compute value between two equal positions");
  }
}
__name(between, "between");
function _between(lo, hi) {
  let index = 0;
  const loLen = lo.length;
  const hiLen = hi.length;
  while (true) {
    const loCode = index < loLen ? lo.charCodeAt(index) : MIN_CODE;
    const hiCode = index < hiLen ? hi.charCodeAt(index) : MAX_CODE;
    if (loCode === hiCode) {
      index++;
      continue;
    }
    if (hiCode - loCode === 1) {
      const size = index + 1;
      let prefix = lo.substring(0, size);
      if (prefix.length < size) {
        prefix += ZERO.repeat(size - prefix.length);
      }
      const suffix = lo.substring(size);
      const nines = "";
      return prefix + _between(suffix, nines);
    } else {
      return takeN(lo, index) + String.fromCharCode(hiCode + loCode >> 1);
    }
  }
}
__name(_between, "_between");
function takeN(pos, n) {
  return n < pos.length ? pos.substring(0, n) : pos + ZERO.repeat(n - pos.length);
}
__name(takeN, "takeN");
var MIN_NON_ZERO_CODE = MIN_CODE + 1;
function isPos(str) {
  if (str === "") {
    return false;
  }
  const lastIdx = str.length - 1;
  const last = str.charCodeAt(lastIdx);
  if (last < MIN_NON_ZERO_CODE || last > MAX_CODE) {
    return false;
  }
  for (let i = 0; i < lastIdx; i++) {
    const code = str.charCodeAt(i);
    if (code < MIN_CODE || code > MAX_CODE) {
      return false;
    }
  }
  return true;
}
__name(isPos, "isPos");
function convertToPos(str) {
  const codes = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    codes.push(code < MIN_CODE ? MIN_CODE : code > MAX_CODE ? MAX_CODE : code);
  }
  while (codes.length > 0 && codes[codes.length - 1] === MIN_CODE) {
    codes.length--;
  }
  return codes.length > 0 ? String.fromCharCode(...codes) : (
    // Edge case: the str was a 0-only string, which is invalid. Default back to .1
    ONE
  );
}
__name(convertToPos, "convertToPos");
function asPos(str) {
  return isPos(str) ? str : convertToPos(str);
}
__name(asPos, "asPos");
function createManagedPool(roomId, options2) {
  const {
    getCurrentConnectionId,
    onDispatch,
    isStorageWritable = /* @__PURE__ */ __name(() => true, "isStorageWritable")
  } = options2;
  let clock = 0;
  let opClock = 0;
  const nodes = /* @__PURE__ */ new Map();
  return {
    roomId,
    nodes,
    getNode: /* @__PURE__ */ __name((id) => nodes.get(id), "getNode"),
    addNode: /* @__PURE__ */ __name((id, node) => void nodes.set(id, node), "addNode"),
    deleteNode: /* @__PURE__ */ __name((id) => void nodes.delete(id), "deleteNode"),
    generateId: /* @__PURE__ */ __name(() => `${getCurrentConnectionId()}:${clock++}`, "generateId"),
    generateOpId: /* @__PURE__ */ __name(() => `${getCurrentConnectionId()}:${opClock++}`, "generateOpId"),
    dispatch(ops, reverse, storageUpdates) {
      onDispatch?.(ops, reverse, storageUpdates);
    },
    assertStorageIsWritable: /* @__PURE__ */ __name(() => {
      if (!isStorageWritable()) {
        throw new Error(
          "Cannot write to storage with a read only user, please ensure the user has write permissions"
        );
      }
    }, "assertStorageIsWritable")
  };
}
__name(createManagedPool, "createManagedPool");
function crdtAsLiveNode(value) {
  return value;
}
__name(crdtAsLiveNode, "crdtAsLiveNode");
function HasParent(node, key, pos = asPos(key)) {
  return Object.freeze({ type: "HasParent", node, key, pos });
}
__name(HasParent, "HasParent");
var NoParent = Object.freeze({ type: "NoParent" });
function Orphaned(oldKey, oldPos = asPos(oldKey)) {
  return Object.freeze({ type: "Orphaned", oldKey, oldPos });
}
__name(Orphaned, "Orphaned");
var AbstractCrdt = class {
  static {
    __name(this, "AbstractCrdt");
  }
  //                  ^^^^^^^^^^^^ TODO: Make this an interface
  #pool;
  #id;
  #parent = NoParent;
  /** @internal */
  _getParentKeyOrThrow() {
    switch (this.parent.type) {
      case "HasParent":
        return this.parent.key;
      case "NoParent":
        throw new Error("Parent key is missing");
      case "Orphaned":
        return this.parent.oldKey;
      default:
        return assertNever2(this.parent, "Unknown state");
    }
  }
  /** @internal */
  get _parentPos() {
    switch (this.parent.type) {
      case "HasParent":
        return this.parent.pos;
      case "NoParent":
        throw new Error("Parent key is missing");
      case "Orphaned":
        return this.parent.oldPos;
      default:
        return assertNever2(this.parent, "Unknown state");
    }
  }
  /** @internal */
  get _pool() {
    return this.#pool;
  }
  get roomId() {
    return this.#pool ? this.#pool.roomId : null;
  }
  /** @internal */
  get _id() {
    return this.#id;
  }
  /** @internal */
  get parent() {
    return this.#parent;
  }
  /** @internal */
  get _parentKey() {
    switch (this.parent.type) {
      case "HasParent":
        return this.parent.key;
      case "NoParent":
        return null;
      case "Orphaned":
        return this.parent.oldKey;
      default:
        return assertNever2(this.parent, "Unknown state");
    }
  }
  /** @internal */
  _apply(op, _isLocal) {
    switch (op.type) {
      case OpCode.DELETE_CRDT: {
        if (this.parent.type === "HasParent") {
          return this.parent.node._detachChild(crdtAsLiveNode(this));
        }
        return { modified: false };
      }
    }
    return { modified: false };
  }
  /** @internal */
  _setParentLink(newParentNode, newParentKey) {
    switch (this.parent.type) {
      case "HasParent":
        if (this.parent.node !== newParentNode) {
          throw new Error("Cannot set parent: node already has a parent");
        } else {
          this.#parent = HasParent(newParentNode, newParentKey);
          return;
        }
      case "Orphaned":
      case "NoParent": {
        this.#parent = HasParent(newParentNode, newParentKey);
        return;
      }
      default:
        return assertNever2(this.parent, "Unknown state");
    }
  }
  /** @internal */
  _attach(id, pool) {
    if (this.#id || this.#pool) {
      throw new Error("Cannot attach node: already attached");
    }
    pool.addNode(id, crdtAsLiveNode(this));
    this.#id = id;
    this.#pool = pool;
  }
  /** @internal */
  _detach() {
    if (this.#pool && this.#id) {
      this.#pool.deleteNode(this.#id);
    }
    switch (this.parent.type) {
      case "HasParent": {
        this.#parent = Orphaned(this.parent.key, this.parent.pos);
        break;
      }
      case "NoParent": {
        this.#parent = NoParent;
        break;
      }
      case "Orphaned": {
        break;
      }
      default:
        assertNever2(this.parent, "Unknown state");
    }
    this.#pool = void 0;
  }
  /**
   * Serializes this CRDT and all its children into a list of creation ops
   * with opIds. Used for forward operations that will be sent over the wire
   * immediately. Each op gets a unique opId for server acknowledgement.
   *
   * @internal
   */
  _toOpsWithOpId(parentId, parentKey, pool) {
    return this._toOps(parentId, parentKey).map((op) => ({
      opId: pool.generateOpId(),
      ...op
    }));
  }
  /** This caches the result of the last .toJSON() call for this Live node. */
  #cachedJson;
  #cachedTreeNodeKey;
  /** This caches the result of the last .toTreeNode() call for this Live node. */
  #cachedTreeNode;
  /**
   * @internal
   *
   * Clear the cached snapshots, so that the next call to `.toJSON()` will
   * recompute. Call this after every mutation to the Live node.
   */
  invalidate() {
    if (this.#cachedJson !== void 0 || this.#cachedTreeNode !== void 0) {
      this.#cachedJson = void 0;
      this.#cachedTreeNode = void 0;
      if (this.parent.type === "HasParent") {
        this.parent.node.invalidate();
      }
    }
  }
  /**
   * @internal
   * Return an snapshot of this Live tree for use in DevTools.
   */
  toTreeNode(key) {
    if (this.#cachedTreeNode === void 0 || this.#cachedTreeNodeKey !== key) {
      this.#cachedTreeNodeKey = key;
      this.#cachedTreeNode = this._toTreeNode(key);
    }
    return this.#cachedTreeNode;
  }
  /**
   * @private
   * Returns true if the cached JSON snapshot exists and is reference-equal
   * to the given value. Does not trigger a recompute.
   */
  hasCache(value) {
    return this.#cachedJson !== void 0 && this.#cachedJson === value;
  }
  /**
   * Return a JSON-compatible snapshot of this Live node and its children.
   * LiveObject values become plain objects, LiveList values become arrays,
   * and LiveMap values also become plain objects (not Map instances).
   * The result is cached and only recomputed when the contents change.
   */
  toJSON() {
    if (this.#cachedJson === void 0) {
      this.#cachedJson = this._toJSON();
    }
    return this.#cachedJson;
  }
};
var LiveRegister = class _LiveRegister extends AbstractCrdt {
  static {
    __name(this, "_LiveRegister");
  }
  #data;
  constructor(data) {
    super();
    this.#data = data;
  }
  get data() {
    return this.#data;
  }
  /** @internal */
  static _deserialize([id, item], _parentToChildren, pool) {
    const register = new _LiveRegister(item.data);
    register._attach(id, pool);
    return register;
  }
  /** @internal */
  _toOps(parentId, parentKey) {
    if (this._id === void 0) {
      throw new Error(
        "Cannot serialize register if parentId or parentKey is undefined"
      );
    }
    return [
      {
        type: OpCode.CREATE_REGISTER,
        id: this._id,
        parentId,
        parentKey,
        data: this.data
      }
    ];
  }
  /** @internal */
  _serialize() {
    if (this.parent.type !== "HasParent") {
      throw new Error("Cannot serialize LiveRegister if parent is missing");
    }
    return {
      type: CrdtType.REGISTER,
      parentId: nn(this.parent.node._id, "Parent node expected to have ID"),
      parentKey: this.parent.key,
      data: this.data
    };
  }
  /** @internal */
  _attachChild(_op) {
    throw new Error("Method not implemented.");
  }
  /** @internal */
  _detachChild(_crdt) {
    throw new Error("Method not implemented.");
  }
  /** @internal */
  _apply(op, isLocal) {
    return super._apply(op, isLocal);
  }
  /** @internal */
  _toTreeNode(key) {
    return {
      type: "Json",
      id: this._id ?? nanoid3(),
      key,
      payload: this.#data
    };
  }
  /** @internal */
  _toJSON() {
    return this.#data;
  }
  clone() {
    return deepClone(this.data);
  }
};
function childNodeLt(a, b) {
  return a._parentPos < b._parentPos;
}
__name(childNodeLt, "childNodeLt");
var LiveList = class _LiveList extends AbstractCrdt {
  static {
    __name(this, "_LiveList");
  }
  #items;
  #implicitlyDeletedItems;
  #unacknowledgedSets;
  constructor(items) {
    super();
    this.#implicitlyDeletedItems = /* @__PURE__ */ new WeakSet();
    this.#unacknowledgedSets = /* @__PURE__ */ new Map();
    const nodes = [];
    let lastPos;
    for (const item of items) {
      const pos = makePosition(lastPos);
      const node = lsonToLiveNode(item);
      node._setParentLink(this, pos);
      nodes.push(node);
      lastPos = pos;
    }
    this.#items = SortedList.fromAlreadySorted(nodes, childNodeLt);
  }
  /** @internal */
  static _deserialize([id, _], parentToChildren, pool) {
    const list2 = new _LiveList([]);
    list2._attach(id, pool);
    const children = parentToChildren.get(id);
    if (children === void 0) {
      return list2;
    }
    for (const node of children) {
      const crdt = node[1];
      const child = deserialize(node, parentToChildren, pool);
      child._setParentLink(list2, crdt.parentKey);
      list2.#insert(child);
    }
    return list2;
  }
  /**
   * @internal
   * This function assumes that the resulting ops will be sent to the server if they have an 'opId'
   * so we mutate _unacknowledgedSets to avoid potential flickering
   * https://github.com/liveblocks/liveblocks/pull/1177
   *
   * This is quite unintuitive and should disappear as soon as
   * we introduce an explicit LiveList.Set operation
   */
  _toOps(parentId, parentKey) {
    if (this._id === void 0) {
      throw new Error("Cannot serialize item is not attached");
    }
    const ops = [];
    const op = {
      id: this._id,
      type: OpCode.CREATE_LIST,
      parentId,
      parentKey
    };
    ops.push(op);
    for (const item of this.#items) {
      const parentKey2 = item._getParentKeyOrThrow();
      const childOps = HACK_addIntentAndDeletedIdToOperation(
        item._toOps(this._id, parentKey2),
        void 0
      );
      for (const childOp of childOps) {
        ops.push(childOp);
      }
    }
    return ops;
  }
  /**
   * Inserts a new child into the list in the correct location (binary search
   * finds correct position efficiently). Returns the insertion index.
   */
  #insert(childNode) {
    const index = this.#items.add(childNode);
    this.invalidate();
    return index;
  }
  /**
   * Updates an item's position and repositions it in the sorted list.
   * Encapsulates the remove -> mutate -> add cycle needed when changing sort keys.
   *
   * IMPORTANT: Item must exist in this list. List count remains unchanged.
   */
  #updateItemPosition(item, newKey) {
    item._setParentLink(this, newKey);
    this.#items.reposition(item);
    this.invalidate();
  }
  /**
   * Updates an item's position by index. Safer than #updateItemPosition when you have
   * an index, as it ensures the item exists and is from this list.
   */
  #updateItemPositionAt(index, newKey) {
    const item = nn(this.#items.at(index));
    this.#updateItemPosition(item, newKey);
  }
  /** @internal */
  _indexOfPosition(position) {
    return this.#items.findIndex(
      (item) => item._getParentKeyOrThrow() === position
    );
  }
  /** @internal */
  _attach(id, pool) {
    super._attach(id, pool);
    for (const item of this.#items) {
      item._attach(pool.generateId(), pool);
    }
  }
  /** @internal */
  _detach() {
    super._detach();
    for (const item of this.#items) {
      item._detach();
    }
  }
  #applySetRemote(op) {
    if (this._pool === void 0) {
      throw new Error("Can't attach child if managed pool is not present");
    }
    const { id, parentKey: key } = op;
    const child = creationOpToLiveNode(op);
    child._attach(id, this._pool);
    child._setParentLink(this, key);
    const deletedId = op.deletedId;
    const indexOfItemWithSamePosition = this._indexOfPosition(key);
    if (indexOfItemWithSamePosition !== -1) {
      const itemWithSamePosition = nn(
        this.#items.removeAt(indexOfItemWithSamePosition)
      );
      if (itemWithSamePosition._id === deletedId) {
        itemWithSamePosition._detach();
        this.#items.add(child);
        return {
          modified: makeUpdate(this, [
            setDelta(indexOfItemWithSamePosition, child)
          ]),
          reverse: []
        };
      } else {
        this.#implicitlyDeletedItems.add(itemWithSamePosition);
        this.#items.remove(itemWithSamePosition);
        this.#items.add(child);
        const delta = [
          setDelta(indexOfItemWithSamePosition, child)
        ];
        const deleteDelta2 = this.#detachItemAssociatedToSetOperation(
          op.deletedId
        );
        if (deleteDelta2) {
          delta.push(deleteDelta2);
        }
        return {
          modified: makeUpdate(this, delta),
          reverse: []
        };
      }
    } else {
      const updates = [];
      const deleteDelta2 = this.#detachItemAssociatedToSetOperation(
        op.deletedId
      );
      if (deleteDelta2) {
        updates.push(deleteDelta2);
      }
      this.#insert(child);
      updates.push(insertDelta(this._indexOfPosition(key), child));
      return {
        reverse: [],
        modified: makeUpdate(this, updates)
      };
    }
  }
  #applySetAck(op) {
    if (this._pool === void 0) {
      throw new Error("Can't attach child if managed pool is not present");
    }
    const delta = [];
    const deletedDelta = this.#detachItemAssociatedToSetOperation(op.deletedId);
    if (deletedDelta) {
      delta.push(deletedDelta);
    }
    const unacknowledgedOpId = this.#unacknowledgedSets.get(op.parentKey);
    if (unacknowledgedOpId !== void 0) {
      if (unacknowledgedOpId !== op.opId) {
        return delta.length === 0 ? { modified: false } : { modified: makeUpdate(this, delta), reverse: [] };
      } else {
        this.#unacknowledgedSets.delete(op.parentKey);
      }
    }
    const indexOfItemWithSamePosition = this._indexOfPosition(op.parentKey);
    const existingItem = this.#items.find((item) => item._id === op.id);
    if (existingItem !== void 0) {
      if (existingItem._parentKey === op.parentKey) {
        return {
          modified: delta.length > 0 ? makeUpdate(this, delta) : false,
          reverse: []
        };
      }
      if (indexOfItemWithSamePosition !== -1) {
        const itemAtPosition = nn(
          this.#items.removeAt(indexOfItemWithSamePosition)
        );
        this.#implicitlyDeletedItems.add(itemAtPosition);
        delta.push(deleteDelta(indexOfItemWithSamePosition, itemAtPosition));
      }
      const prevIndex = this.#items.findIndex((item) => item === existingItem);
      this.#updateItemPosition(existingItem, op.parentKey);
      const newIndex = this.#items.findIndex((item) => item === existingItem);
      if (newIndex !== prevIndex) {
        delta.push(moveDelta(prevIndex, newIndex, existingItem));
      }
      return {
        modified: delta.length > 0 ? makeUpdate(this, delta) : false,
        reverse: []
      };
    } else {
      const orphan = this._pool.getNode(op.id);
      if (orphan && this.#implicitlyDeletedItems.has(orphan)) {
        orphan._setParentLink(this, op.parentKey);
        this.#implicitlyDeletedItems.delete(orphan);
        const recreatedItemIndex = this.#insert(orphan);
        return {
          modified: makeUpdate(this, [
            // If there is an item at this position, update is a set, else it's an insert
            indexOfItemWithSamePosition === -1 ? insertDelta(recreatedItemIndex, orphan) : setDelta(recreatedItemIndex, orphan),
            ...delta
          ]),
          reverse: []
        };
      } else {
        if (indexOfItemWithSamePosition !== -1) {
          const displaced = nn(
            this.#items.removeAt(indexOfItemWithSamePosition)
          );
          this.#implicitlyDeletedItems.add(displaced);
        }
        const { newItem, newIndex } = this.#createAttachItemAndSort(
          op,
          op.parentKey
        );
        return {
          modified: makeUpdate(this, [
            // If there is an item at this position, update is a set, else it's an insert
            indexOfItemWithSamePosition === -1 ? insertDelta(newIndex, newItem) : setDelta(newIndex, newItem),
            ...delta
          ]),
          reverse: []
        };
      }
    }
  }
  /**
   * Returns the update delta of the deletion or null
   */
  #detachItemAssociatedToSetOperation(deletedId) {
    if (deletedId === void 0 || this._pool === void 0) {
      return null;
    }
    const deletedItem = this._pool.getNode(deletedId);
    if (deletedItem === void 0) {
      return null;
    }
    const result = this._detachChild(deletedItem);
    if (result.modified === false) {
      return null;
    }
    return result.modified.updates[0];
  }
  #applyRemoteInsert(op) {
    if (this._pool === void 0) {
      throw new Error("Can't attach child if managed pool is not present");
    }
    const key = asPos(op.parentKey);
    const existingItemIndex = this._indexOfPosition(key);
    if (existingItemIndex !== -1) {
      this.#shiftItemPosition(existingItemIndex, key);
    }
    const { newItem, newIndex } = this.#createAttachItemAndSort(op, key);
    return {
      modified: makeUpdate(this, [insertDelta(newIndex, newItem)]),
      reverse: []
    };
  }
  #applyInsertAck(op) {
    const existingItem = this.#items.find((item) => item._id === op.id);
    const key = asPos(op.parentKey);
    const itemIndexAtPosition = this._indexOfPosition(key);
    if (existingItem) {
      if (existingItem._parentKey === key) {
        return {
          modified: false
        };
      } else {
        const oldPositionIndex = this.#items.findIndex(
          (item) => item === existingItem
        );
        if (itemIndexAtPosition !== -1) {
          this.#shiftItemPosition(itemIndexAtPosition, key);
        }
        this.#updateItemPosition(existingItem, key);
        const newIndex = this._indexOfPosition(key);
        if (newIndex === oldPositionIndex) {
          return { modified: false };
        }
        return {
          modified: makeUpdate(this, [
            moveDelta(oldPositionIndex, newIndex, existingItem)
          ]),
          reverse: []
        };
      }
    } else {
      const orphan = nn(this._pool).getNode(op.id);
      if (orphan && this.#implicitlyDeletedItems.has(orphan)) {
        orphan._setParentLink(this, key);
        this.#implicitlyDeletedItems.delete(orphan);
        this.#insert(orphan);
        const newIndex = this._indexOfPosition(key);
        return {
          modified: makeUpdate(this, [insertDelta(newIndex, orphan)]),
          reverse: []
        };
      } else {
        if (itemIndexAtPosition !== -1) {
          this.#shiftItemPosition(itemIndexAtPosition, key);
        }
        const { newItem, newIndex } = this.#createAttachItemAndSort(op, key);
        return {
          modified: makeUpdate(this, [insertDelta(newIndex, newItem)]),
          reverse: []
        };
      }
    }
  }
  #applyInsertUndoRedo(op) {
    const { id, parentKey: key } = op;
    const child = creationOpToLiveNode(op);
    if (this._pool?.getNode(id) !== void 0) {
      return { modified: false };
    }
    child._attach(id, nn(this._pool));
    child._setParentLink(this, key);
    const existingItemIndex = this._indexOfPosition(key);
    let newKey = key;
    if (existingItemIndex !== -1) {
      const before2 = this.#items.at(existingItemIndex)?._parentPos;
      const after2 = this.#items.at(existingItemIndex + 1)?._parentPos;
      newKey = makePosition(before2, after2);
      child._setParentLink(this, newKey);
    }
    this.#insert(child);
    const newIndex = this._indexOfPosition(newKey);
    return {
      modified: makeUpdate(this, [insertDelta(newIndex, child)]),
      reverse: [{ type: OpCode.DELETE_CRDT, id }]
    };
  }
  #applySetUndoRedo(op) {
    const { id, parentKey: key } = op;
    const child = creationOpToLiveNode(op);
    if (this._pool?.getNode(id) !== void 0) {
      return { modified: false };
    }
    this.#unacknowledgedSets.set(key, nn(op.opId));
    const indexOfItemWithSameKey = this._indexOfPosition(key);
    child._attach(id, nn(this._pool));
    child._setParentLink(this, key);
    const newKey = key;
    if (indexOfItemWithSameKey !== -1) {
      const existingItem = this.#items.at(indexOfItemWithSameKey);
      existingItem._detach();
      this.#items.remove(existingItem);
      this.#items.add(child);
      const reverse = HACK_addIntentAndDeletedIdToOperation(
        existingItem._toOps(nn(this._id), key),
        op.id
      );
      const delta = [setDelta(indexOfItemWithSameKey, child)];
      const deletedDelta = this.#detachItemAssociatedToSetOperation(
        op.deletedId
      );
      if (deletedDelta) {
        delta.push(deletedDelta);
      }
      return {
        modified: makeUpdate(this, delta),
        reverse
      };
    } else {
      this.#insert(child);
      this.#detachItemAssociatedToSetOperation(op.deletedId);
      const newIndex = this._indexOfPosition(newKey);
      return {
        reverse: [{ type: OpCode.DELETE_CRDT, id }],
        modified: makeUpdate(this, [insertDelta(newIndex, child)])
      };
    }
  }
  /** @internal */
  _attachChild(op, source) {
    if (this._pool === void 0) {
      throw new Error("Can't attach child if managed pool is not present");
    }
    let result;
    if (op.intent === "set") {
      if (source === 1) {
        result = this.#applySetRemote(op);
      } else if (source === 2) {
        result = this.#applySetAck(op);
      } else {
        result = this.#applySetUndoRedo(op);
      }
    } else {
      if (source === 1) {
        result = this.#applyRemoteInsert(op);
      } else if (source === 2) {
        result = this.#applyInsertAck(op);
      } else {
        result = this.#applyInsertUndoRedo(op);
      }
    }
    if (result.modified !== false) {
      this.invalidate();
    }
    return result;
  }
  /** @internal */
  _detachChild(child) {
    if (child) {
      const parentKey = nn(child._parentKey);
      const reverse = child._toOps(nn(this._id), parentKey);
      const indexToDelete = this.#items.findIndex((item) => item === child);
      if (indexToDelete === -1) {
        return {
          modified: false
        };
      }
      const previousNode = this.#items.at(indexToDelete);
      this.#items.remove(child);
      this.invalidate();
      child._detach();
      return {
        modified: makeUpdate(this, [deleteDelta(indexToDelete, previousNode)]),
        reverse
      };
    }
    return { modified: false };
  }
  #applySetChildKeyRemote(newKey, child) {
    if (this.#implicitlyDeletedItems.has(child)) {
      this.#implicitlyDeletedItems.delete(child);
      child._setParentLink(this, newKey);
      const newIndex = this.#insert(child);
      return {
        modified: makeUpdate(this, [insertDelta(newIndex, child)]),
        reverse: []
      };
    }
    const previousKey = child._parentKey;
    if (newKey === previousKey) {
      return {
        modified: false
      };
    }
    const existingItemIndex = this._indexOfPosition(newKey);
    if (existingItemIndex === -1) {
      const previousIndex = this.#items.findIndex((item) => item === child);
      this.#updateItemPosition(child, newKey);
      const newIndex = this.#items.findIndex((item) => item === child);
      if (newIndex === previousIndex) {
        return {
          modified: false
        };
      }
      return {
        modified: makeUpdate(this, [moveDelta(previousIndex, newIndex, child)]),
        reverse: []
      };
    } else {
      this.#updateItemPositionAt(
        existingItemIndex,
        makePosition(newKey, this.#items.at(existingItemIndex + 1)?._parentPos)
      );
      const previousIndex = this.#items.findIndex((item) => item === child);
      this.#updateItemPosition(child, newKey);
      const newIndex = this.#items.findIndex((item) => item === child);
      if (newIndex === previousIndex) {
        return {
          modified: false
        };
      }
      return {
        modified: makeUpdate(this, [moveDelta(previousIndex, newIndex, child)]),
        reverse: []
      };
    }
  }
  #applySetChildKeyAck(newKey, child) {
    const previousKey = nn(child._parentKey);
    if (this.#implicitlyDeletedItems.has(child)) {
      const existingItemIndex = this._indexOfPosition(newKey);
      this.#implicitlyDeletedItems.delete(child);
      if (existingItemIndex !== -1) {
        const existingItem = this.#items.at(existingItemIndex);
        existingItem._setParentLink(
          this,
          makePosition(
            newKey,
            this.#items.at(existingItemIndex + 1)?._parentPos
          )
        );
        this.#items.reposition(existingItem);
      }
      child._setParentLink(this, newKey);
      const newIndex = this.#insert(child);
      return {
        modified: makeUpdate(this, [insertDelta(newIndex, child)]),
        reverse: []
      };
    } else {
      if (newKey === previousKey) {
        return {
          modified: false
        };
      }
      const previousIndex = this.#items.findIndex((item) => item === child);
      const existingItemIndex = this._indexOfPosition(newKey);
      if (existingItemIndex !== -1) {
        this.#updateItemPositionAt(
          existingItemIndex,
          makePosition(
            newKey,
            this.#items.at(existingItemIndex + 1)?._parentPos
          )
        );
      }
      this.#updateItemPosition(child, newKey);
      const newIndex = this.#items.findIndex((item) => item === child);
      if (previousIndex === newIndex) {
        return {
          modified: false
        };
      } else {
        return {
          modified: makeUpdate(this, [
            moveDelta(previousIndex, newIndex, child)
          ]),
          reverse: []
        };
      }
    }
  }
  #applySetChildKeyUndoRedo(newKey, child) {
    const previousKey = nn(child._parentKey);
    const previousIndex = this.#items.findIndex((item) => item === child);
    const existingItemIndex = this._indexOfPosition(newKey);
    let actualNewKey = newKey;
    if (existingItemIndex !== -1) {
      actualNewKey = makePosition(
        newKey,
        this.#items.at(existingItemIndex + 1)?._parentPos
      );
    }
    this.#updateItemPosition(child, actualNewKey);
    const newIndex = this.#items.findIndex((item) => item === child);
    if (previousIndex === newIndex) {
      return {
        modified: false
      };
    }
    return {
      modified: makeUpdate(this, [moveDelta(previousIndex, newIndex, child)]),
      reverse: [
        {
          type: OpCode.SET_PARENT_KEY,
          id: nn(child._id),
          parentKey: previousKey
        }
      ]
    };
  }
  /** @internal */
  _setChildKey(newKey, child, source) {
    if (source === 1) {
      return this.#applySetChildKeyRemote(newKey, child);
    } else if (source === 2) {
      return this.#applySetChildKeyAck(newKey, child);
    } else {
      return this.#applySetChildKeyUndoRedo(newKey, child);
    }
  }
  /** @internal */
  _apply(op, isLocal) {
    return super._apply(op, isLocal);
  }
  /** @internal */
  _serialize() {
    if (this.parent.type !== "HasParent") {
      throw new Error("Cannot serialize LiveList if parent is missing");
    }
    return {
      type: CrdtType.LIST,
      parentId: nn(this.parent.node._id, "Parent node expected to have ID"),
      parentKey: this.parent.key
    };
  }
  /**
   * Returns the number of elements.
   */
  get length() {
    return this.#items.length;
  }
  /**
   * Adds one element to the end of the LiveList.
   * @param element The element to add to the end of the LiveList.
   */
  push(element) {
    this._pool?.assertStorageIsWritable();
    return this.insert(element, this.length);
  }
  /**
   * Inserts one element at a specified index.
   * @param element The element to insert.
   * @param index The index at which you want to insert the element.
   */
  insert(element, index) {
    this._pool?.assertStorageIsWritable();
    if (index < 0 || index > this.#items.length) {
      throw new Error(
        `Cannot insert list item at index "${index}". index should be between 0 and ${this.#items.length}`
      );
    }
    const before2 = this.#items.at(index - 1)?._parentPos;
    const after2 = this.#items.at(index)?._parentPos;
    const position = makePosition(before2, after2);
    const value = lsonToLiveNode(element);
    value._setParentLink(this, position);
    this.#insert(value);
    if (this._pool && this._id) {
      const id = this._pool.generateId();
      value._attach(id, this._pool);
      this._pool.dispatch(
        value._toOpsWithOpId(this._id, position, this._pool),
        [{ type: OpCode.DELETE_CRDT, id }],
        /* @__PURE__ */ new Map([
          [this._id, makeUpdate(this, [insertDelta(index, value)])]
        ])
      );
    }
  }
  /**
   * Move one element from one index to another.
   * @param index The index of the element to move
   * @param targetIndex The index where the element should be after moving.
   */
  move(index, targetIndex) {
    this._pool?.assertStorageIsWritable();
    if (targetIndex < 0) {
      throw new Error("targetIndex cannot be less than 0");
    }
    if (targetIndex >= this.#items.length) {
      throw new Error(
        "targetIndex cannot be greater or equal than the list length"
      );
    }
    if (index < 0) {
      throw new Error("index cannot be less than 0");
    }
    if (index >= this.#items.length) {
      throw new Error("index cannot be greater or equal than the list length");
    }
    let beforePosition = null;
    let afterPosition = null;
    if (index < targetIndex) {
      afterPosition = targetIndex === this.#items.length - 1 ? void 0 : this.#items.at(targetIndex + 1)?._parentPos;
      beforePosition = this.#items.at(targetIndex)._parentPos;
    } else {
      afterPosition = this.#items.at(targetIndex)._parentPos;
      beforePosition = targetIndex === 0 ? void 0 : this.#items.at(targetIndex - 1)?._parentPos;
    }
    const position = makePosition(beforePosition, afterPosition);
    const item = this.#items.at(index);
    const previousPosition = item._getParentKeyOrThrow();
    this.#updateItemPositionAt(index, position);
    if (this._pool && this._id) {
      const storageUpdates = /* @__PURE__ */ new Map([
        [this._id, makeUpdate(this, [moveDelta(index, targetIndex, item)])]
      ]);
      this._pool.dispatch(
        [
          {
            type: OpCode.SET_PARENT_KEY,
            id: nn(item._id),
            opId: this._pool.generateOpId(),
            parentKey: position
          }
        ],
        [
          {
            type: OpCode.SET_PARENT_KEY,
            id: nn(item._id),
            parentKey: previousPosition
          }
        ],
        storageUpdates
      );
    }
  }
  /**
   * Deletes an element at the specified index
   * @param index The index of the element to delete
   */
  delete(index) {
    this._pool?.assertStorageIsWritable();
    if (index < 0 || index >= this.#items.length) {
      throw new Error(
        `Cannot delete list item at index "${index}". index should be between 0 and ${this.#items.length - 1}`
      );
    }
    const item = this.#items.at(index);
    item._detach();
    this.#items.remove(item);
    this.invalidate();
    if (this._pool) {
      const childRecordId = item._id;
      if (childRecordId) {
        const storageUpdates = /* @__PURE__ */ new Map();
        storageUpdates.set(
          nn(this._id),
          makeUpdate(this, [deleteDelta(index, item)])
        );
        this._pool.dispatch(
          [
            {
              id: childRecordId,
              opId: this._pool.generateOpId(),
              type: OpCode.DELETE_CRDT
            }
          ],
          item._toOps(nn(this._id), item._getParentKeyOrThrow()),
          storageUpdates
        );
      }
    }
  }
  clear() {
    this._pool?.assertStorageIsWritable();
    if (this._pool) {
      const ops = [];
      const reverseOps = [];
      const updateDelta = [];
      for (const item of this.#items) {
        item._detach();
        const childId = item._id;
        if (childId) {
          ops.push({
            type: OpCode.DELETE_CRDT,
            id: childId,
            opId: this._pool.generateOpId()
          });
          reverseOps.push(
            ...item._toOps(nn(this._id), item._getParentKeyOrThrow())
          );
          updateDelta.push(deleteDelta(0, item));
        }
      }
      this.#items.clear();
      this.invalidate();
      const storageUpdates = /* @__PURE__ */ new Map();
      storageUpdates.set(nn(this._id), makeUpdate(this, updateDelta));
      this._pool.dispatch(ops, reverseOps, storageUpdates);
    } else {
      for (const item of this.#items) {
        item._detach();
      }
      this.#items.clear();
      this.invalidate();
    }
  }
  set(index, item) {
    this._pool?.assertStorageIsWritable();
    if (index < 0 || index >= this.#items.length) {
      throw new Error(
        `Cannot set list item at index "${index}". index should be between 0 and ${this.#items.length - 1}`
      );
    }
    const existingItem = this.#items.at(index);
    const position = existingItem._getParentKeyOrThrow();
    const existingId = existingItem._id;
    existingItem._detach();
    const value = lsonToLiveNode(item);
    value._setParentLink(this, position);
    this.#items.remove(existingItem);
    this.#items.add(value);
    this.invalidate();
    if (this._pool && this._id) {
      const id = this._pool.generateId();
      value._attach(id, this._pool);
      const storageUpdates = /* @__PURE__ */ new Map();
      storageUpdates.set(this._id, makeUpdate(this, [setDelta(index, value)]));
      const ops = HACK_addIntentAndDeletedIdToOperation(
        value._toOpsWithOpId(this._id, position, this._pool),
        existingId
      );
      this.#unacknowledgedSets.set(position, nn(ops[0].opId));
      const reverseOps = HACK_addIntentAndDeletedIdToOperation(
        existingItem._toOps(this._id, position),
        id
      );
      this._pool.dispatch(ops, reverseOps, storageUpdates);
    }
  }
  #unwrap(node) {
    return liveNodeToLson(node);
  }
  /**
   * Tests whether all elements pass the test implemented by the provided function.
   * @param predicate Function to test for each element, taking two arguments (the element and its index).
   * @returns true if the predicate function returns a truthy value for every element. Otherwise, false.
   */
  every(predicate) {
    return this.#items.rawArray.every(
      (node, i) => predicate(this.#unwrap(node), i)
    );
  }
  /**
   * Creates an array with all elements that pass the test implemented by the provided function.
   * @param predicate Function to test each element of the LiveList. Return a value that coerces to true to keep the element, or to false otherwise.
   * @returns An array with the elements that pass the test.
   */
  filter(predicate) {
    const result = [];
    this.#items.rawArray.forEach((node, i) => {
      const item = this.#unwrap(node);
      if (predicate(item, i)) result.push(item);
    });
    return result;
  }
  /**
   * Returns the first element that satisfies the provided testing function.
   * @param predicate Function to execute on each value.
   * @returns The value of the first element in the LiveList that satisfies the provided testing function. Otherwise, undefined is returned.
   */
  find(predicate) {
    for (const [i, node] of this.#items.rawArray.entries()) {
      const item = this.#unwrap(node);
      if (predicate(item, i)) return item;
    }
    return void 0;
  }
  /**
   * Returns the index of the first element in the LiveList that satisfies the provided testing function.
   * @param predicate Function to execute on each value until the function returns true, indicating that the satisfying element was found.
   * @returns The index of the first element in the LiveList that passes the test. Otherwise, -1.
   */
  findIndex(predicate) {
    return this.#items.rawArray.findIndex(
      (node, i) => predicate(this.#unwrap(node), i)
    );
  }
  /**
   * Executes a provided function once for each element.
   * @param callbackfn Function to execute on each element.
   */
  forEach(callbackfn) {
    this.#items.rawArray.forEach(
      (node, i) => callbackfn(this.#unwrap(node), i)
    );
  }
  /**
   * Get the element at the specified index.
   * @param index The index on the element to get.
   * @returns The element at the specified index or undefined.
   */
  get(index) {
    const item = this.#items.at(index);
    return item !== void 0 ? this.#unwrap(item) : void 0;
  }
  /**
   * Returns the first index at which a given element can be found in the LiveList, or -1 if it is not present.
   * @param searchElement Element to locate.
   * @param fromIndex The index to start the search at.
   * @returns The first index of the element in the LiveList; -1 if not found.
   */
  indexOf(searchElement, fromIndex) {
    return this.#items.rawArray.findIndex(
      (node, i) => i >= (fromIndex ?? 0) && this.#unwrap(node) === searchElement
    );
  }
  /**
   * Returns the last index at which a given element can be found in the LiveList, or -1 if it is not present. The LiveList is searched backwards, starting at fromIndex.
   * @param searchElement Element to locate.
   * @param fromIndex The index at which to start searching backwards.
   * @returns The last index of the element in the LiveList; -1 if not found.
   */
  lastIndexOf(searchElement, fromIndex) {
    const arr = this.#items.rawArray;
    for (let i = fromIndex ?? arr.length - 1; i >= 0; i--) {
      if (this.#unwrap(arr[i]) === searchElement) return i;
    }
    return -1;
  }
  /**
   * Creates an array populated with the results of calling a provided function on every element.
   * @param callback Function that is called for every element.
   * @returns An array with each element being the result of the callback function.
   */
  map(callback) {
    return this.#items.rawArray.map(
      (node, i) => callback(this.#unwrap(node), i)
    );
  }
  /**
   * Tests whether at least one element in the LiveList passes the test implemented by the provided function.
   * @param predicate Function to test for each element.
   * @returns true if the callback function returns a truthy value for at least one element. Otherwise, false.
   */
  some(predicate) {
    return this.#items.rawArray.some(
      (node, i) => predicate(this.#unwrap(node), i)
    );
  }
  *[Symbol.iterator]() {
    for (const node of this.#items) {
      yield this.#unwrap(node);
    }
  }
  #createAttachItemAndSort(op, key) {
    const newItem = creationOpToLiveNode(op);
    newItem._attach(op.id, nn(this._pool));
    newItem._setParentLink(this, key);
    this.#insert(newItem);
    const newIndex = this._indexOfPosition(key);
    return { newItem, newIndex };
  }
  #shiftItemPosition(index, key) {
    const shiftedPosition = makePosition(
      key,
      this.#items.length > index + 1 ? this.#items.at(index + 1)?._parentPos : void 0
    );
    this.#updateItemPositionAt(index, shiftedPosition);
  }
  /** @internal */
  _toTreeNode(key) {
    const payload = [];
    let index = 0;
    for (const item of this.#items) {
      payload.push(item.toTreeNode(index.toString()));
      index++;
    }
    return {
      type: "LiveList",
      id: this._id ?? nanoid3(),
      key,
      payload
    };
  }
  toJSON() {
    return super.toJSON();
  }
  /** @internal */
  _toJSON() {
    const result = Array.from(this.#items, (node) => node.toJSON());
    return freeze(result);
  }
  clone() {
    return new _LiveList(
      Array.from(this.#items, (item) => item.clone())
    );
  }
};
function makeUpdate(liveList, deltaUpdates) {
  return {
    node: liveList,
    type: "LiveList",
    updates: deltaUpdates
  };
}
__name(makeUpdate, "makeUpdate");
function setDelta(index, item) {
  return {
    index,
    type: "set",
    item: item instanceof LiveRegister ? item.data : item
  };
}
__name(setDelta, "setDelta");
function deleteDelta(index, deletedNode) {
  return {
    type: "delete",
    index,
    deletedItem: deletedNode instanceof LiveRegister ? deletedNode.data : deletedNode
  };
}
__name(deleteDelta, "deleteDelta");
function insertDelta(index, item) {
  return {
    index,
    type: "insert",
    item: item instanceof LiveRegister ? item.data : item
  };
}
__name(insertDelta, "insertDelta");
function moveDelta(previousIndex, index, item) {
  return {
    type: "move",
    index,
    item: item instanceof LiveRegister ? item.data : item,
    previousIndex
  };
}
__name(moveDelta, "moveDelta");
function HACK_addIntentAndDeletedIdToOperation(ops, deletedId) {
  return ops.map((op, index) => {
    if (index === 0) {
      const firstOp = op;
      return {
        ...firstOp,
        intent: "set",
        deletedId
      };
    } else {
      return op;
    }
  });
}
__name(HACK_addIntentAndDeletedIdToOperation, "HACK_addIntentAndDeletedIdToOperation");
var LiveMap = class _LiveMap extends AbstractCrdt {
  static {
    __name(this, "_LiveMap");
  }
  #map;
  #unacknowledgedSet;
  constructor(entries2) {
    super();
    this.#unacknowledgedSet = /* @__PURE__ */ new Map();
    if (entries2) {
      const mappedEntries = [];
      for (const [key, value] of entries2) {
        const node = lsonToLiveNode(value);
        node._setParentLink(this, key);
        mappedEntries.push([key, node]);
      }
      this.#map = new Map(mappedEntries);
    } else {
      this.#map = /* @__PURE__ */ new Map();
    }
  }
  /** @internal */
  _toOps(parentId, parentKey) {
    if (this._id === void 0) {
      throw new Error("Cannot serialize item is not attached");
    }
    const ops = [];
    const op = {
      id: this._id,
      type: OpCode.CREATE_MAP,
      parentId,
      parentKey
    };
    ops.push(op);
    for (const [key, value] of this.#map) {
      for (const childOp of value._toOps(this._id, key)) {
        ops.push(childOp);
      }
    }
    return ops;
  }
  /** @internal */
  static _deserialize([id, _item], parentToChildren, pool) {
    const map2 = new _LiveMap();
    map2._attach(id, pool);
    const children = parentToChildren.get(id);
    if (children === void 0) {
      return map2;
    }
    for (const node of children) {
      const crdt = node[1];
      const child = deserialize(node, parentToChildren, pool);
      child._setParentLink(map2, crdt.parentKey);
      map2.#map.set(crdt.parentKey, child);
      map2.invalidate();
    }
    return map2;
  }
  /** @internal */
  _attach(id, pool) {
    super._attach(id, pool);
    for (const [_key, value] of this.#map) {
      if (isLiveNode(value)) {
        value._attach(pool.generateId(), pool);
      }
    }
  }
  /** @internal */
  _attachChild(op, source) {
    if (this._pool === void 0) {
      throw new Error("Can't attach child if managed pool is not present");
    }
    const { id, parentKey, opId } = op;
    const key = parentKey;
    const child = creationOpToLiveNode(op);
    if (this._pool.getNode(id) !== void 0) {
      return { modified: false };
    }
    if (source === 2) {
      const lastUpdateOpId = this.#unacknowledgedSet.get(key);
      if (lastUpdateOpId === opId) {
        this.#unacknowledgedSet.delete(key);
        return { modified: false };
      } else if (lastUpdateOpId !== void 0) {
        return { modified: false };
      }
    } else if (source === 1) {
      this.#unacknowledgedSet.delete(key);
    }
    const previousValue = this.#map.get(key);
    let reverse;
    if (previousValue) {
      const thisId = nn(this._id);
      reverse = previousValue._toOps(thisId, key);
      previousValue._detach();
    } else {
      reverse = [{ type: OpCode.DELETE_CRDT, id }];
    }
    child._setParentLink(this, key);
    child._attach(id, this._pool);
    this.#map.set(key, child);
    this.invalidate();
    return {
      modified: {
        node: this,
        type: "LiveMap",
        updates: { [key]: { type: "update" } }
      },
      reverse
    };
  }
  /** @internal */
  _detach() {
    super._detach();
    for (const item of this.#map.values()) {
      item._detach();
    }
  }
  /** @internal */
  _detachChild(child) {
    const id = nn(this._id);
    const parentKey = nn(child._parentKey);
    const reverse = child._toOps(id, parentKey);
    for (const [key, value] of this.#map) {
      if (value === child) {
        this.#map.delete(key);
        this.invalidate();
      }
    }
    child._detach();
    const storageUpdate = {
      node: this,
      type: "LiveMap",
      updates: {
        [parentKey]: {
          type: "delete",
          deletedItem: liveNodeToLson(child)
        }
      }
    };
    return { modified: storageUpdate, reverse };
  }
  /** @internal */
  _serialize() {
    if (this.parent.type !== "HasParent") {
      throw new Error("Cannot serialize LiveMap if parent is missing");
    }
    return {
      type: CrdtType.MAP,
      parentId: nn(this.parent.node._id, "Parent node expected to have ID"),
      parentKey: this.parent.key
    };
  }
  /**
   * Returns a specified element from the LiveMap.
   * @param key The key of the element to return.
   * @returns The element associated with the specified key, or undefined if the key can't be found in the LiveMap.
   */
  get(key) {
    const value = this.#map.get(key);
    if (value === void 0) {
      return void 0;
    }
    return liveNodeToLson(value);
  }
  /**
   * Adds or updates an element with a specified key and a value.
   * @param key The key of the element to add. Should be a string.
   * @param value The value of the element to add. Should be serializable to JSON.
   */
  set(key, value) {
    this._pool?.assertStorageIsWritable();
    const oldValue = this.#map.get(key);
    if (oldValue) {
      oldValue._detach();
    }
    const item = lsonToLiveNode(value);
    item._setParentLink(this, key);
    this.#map.set(key, item);
    this.invalidate();
    if (this._pool && this._id) {
      const id = this._pool.generateId();
      item._attach(id, this._pool);
      const storageUpdates = /* @__PURE__ */ new Map();
      storageUpdates.set(this._id, {
        node: this,
        type: "LiveMap",
        updates: { [key]: { type: "update" } }
      });
      const ops = item._toOpsWithOpId(this._id, key, this._pool);
      this.#unacknowledgedSet.set(key, nn(ops[0].opId));
      this._pool.dispatch(
        ops,
        oldValue ? oldValue._toOps(this._id, key) : [{ type: OpCode.DELETE_CRDT, id }],
        storageUpdates
      );
    }
  }
  /**
   * Returns the number of elements in the LiveMap.
   */
  get size() {
    return this.#map.size;
  }
  /**
   * Returns a boolean indicating whether an element with the specified key exists or not.
   * @param key The key of the element to test for presence.
   */
  has(key) {
    return this.#map.has(key);
  }
  /**
   * Removes the specified element by key.
   * @param key The key of the element to remove.
   * @returns true if an element existed and has been removed, or false if the element does not exist.
   */
  delete(key) {
    this._pool?.assertStorageIsWritable();
    const item = this.#map.get(key);
    if (item === void 0) {
      return false;
    }
    item._detach();
    this.#map.delete(key);
    this.invalidate();
    if (this._pool && item._id) {
      const thisId = nn(this._id);
      const storageUpdates = /* @__PURE__ */ new Map();
      storageUpdates.set(thisId, {
        node: this,
        type: "LiveMap",
        updates: {
          [key]: {
            type: "delete",
            deletedItem: liveNodeToLson(item)
          }
        }
      });
      this._pool.dispatch(
        [
          {
            type: OpCode.DELETE_CRDT,
            id: item._id,
            opId: this._pool.generateOpId()
          }
        ],
        item._toOps(thisId, key),
        storageUpdates
      );
    }
    return true;
  }
  /**
   * Returns a new Iterator object that contains the [key, value] pairs for each element.
   */
  entries() {
    const innerIterator = this.#map.entries();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        const iteratorValue = innerIterator.next();
        if (iteratorValue.done) {
          return {
            done: true,
            value: void 0
          };
        }
        const entry = iteratorValue.value;
        const key = entry[0];
        const value = liveNodeToLson(iteratorValue.value[1]);
        return {
          value: [key, value]
        };
      }
    };
  }
  /**
   * Same function object as the initial value of the entries method.
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Returns a new Iterator object that contains the keys for each element.
   */
  keys() {
    return this.#map.keys();
  }
  /**
   * Returns a new Iterator object that contains the values for each element.
   */
  values() {
    const innerIterator = this.#map.values();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        const iteratorValue = innerIterator.next();
        if (iteratorValue.done) {
          return {
            done: true,
            value: void 0
          };
        }
        const value = liveNodeToLson(iteratorValue.value);
        return { value };
      }
    };
  }
  /**
   * Executes a provided function once per each key/value pair in the Map object, in insertion order.
   * @param callback Function to execute for each entry in the map.
   */
  forEach(callback) {
    for (const entry of this) {
      callback(entry[1], entry[0], this);
    }
  }
  /** @internal */
  _toTreeNode(key) {
    return {
      type: "LiveMap",
      id: this._id ?? nanoid3(),
      key,
      payload: Array.from(this.#map.entries()).map(
        ([key2, val]) => val.toTreeNode(key2)
      )
    };
  }
  toJSON() {
    return super.toJSON();
  }
  /** @internal */
  _toJSON() {
    const result = {};
    for (const [key, value] of this.#map) {
      result[key] = value.toJSON();
    }
    return freeze(result);
  }
  clone() {
    return new _LiveMap(
      Array.from(this.#map).map(([key, node]) => [key, node.clone()])
    );
  }
};
function deepLiveify(value, config2) {
  if (Array.isArray(value)) {
    return new LiveList(value.map((v) => deepLiveify(v, config2)));
  } else if (isPlainObject2(value)) {
    const init = {};
    const locals = {};
    for (const key in value) {
      const val = value[key];
      if (val === void 0) {
        continue;
      }
      const subConfig = isPlainObject2(config2) ? config2[key] : config2;
      if (subConfig === false) {
        locals[key] = val;
      } else if (subConfig === "atomic") {
        init[key] = val;
      } else {
        init[key] = deepLiveify(val, subConfig);
      }
    }
    const lo = new LiveObject(init);
    for (const key in locals) {
      lo.setLocal(key, locals[key]);
    }
    return lo;
  } else {
    return value;
  }
}
__name(deepLiveify, "deepLiveify");
function reconcile(live, json2, config2) {
  if (isLiveObject(live) && isPlainObject2(json2)) {
    return reconcileLiveObject(live, json2, "full", config2);
  } else if (isLiveList(live) && Array.isArray(json2)) {
    return reconcileLiveList(live, json2, config2);
  } else if (isLiveMap(live) && isPlainObject2(json2)) {
    return reconcileLiveMap(live, config2);
  } else {
    return deepLiveify(json2, config2);
  }
}
__name(reconcile, "reconcile");
function reconcileLiveMap(_liveMap, _config) {
  throw new Error("Reconciling a LiveMap is not supported yet");
}
__name(reconcileLiveMap, "reconcileLiveMap");
function reconcileLiveObject(liveObj, jsonObj, extent, config2) {
  const currentKeys = liveObj.keys();
  for (const key in jsonObj) {
    currentKeys.delete(key);
    const newVal = jsonObj[key];
    if (newVal === void 0) {
      if (extent === "full") {
        liveObj.delete(key);
      }
      continue;
    }
    const subConfig = isPlainObject2(config2) ? config2[key] : config2;
    if (subConfig === false) {
      liveObj.setLocal(key, newVal);
    } else if (subConfig === "atomic") {
      const curVal = liveObj.get(key);
      if (curVal !== newVal) {
        liveObj.set(key, newVal);
      }
    } else {
      const curVal = liveObj.get(key);
      if (curVal === void 0) {
        liveObj.set(key, deepLiveify(newVal, subConfig));
      } else if (isLiveStructure(curVal)) {
        const next = reconcile(curVal, newVal, subConfig);
        if (next !== curVal) {
          liveObj.set(key, next);
        }
      } else if (curVal !== newVal) {
        liveObj.set(key, deepLiveify(newVal, subConfig));
      }
    }
  }
  if (extent === "full") {
    for (const key of currentKeys) {
      liveObj.delete(key);
    }
  }
  return liveObj;
}
__name(reconcileLiveObject, "reconcileLiveObject");
function reconcileLiveList(liveList, jsonArr, config2) {
  const curLen = liveList.length;
  const newLen = jsonArr.length;
  for (let i = 0; i < Math.min(curLen, newLen); i++) {
    const curVal = liveList.get(i);
    const newVal = jsonArr[i];
    if (isLiveStructure(curVal)) {
      const next = reconcile(curVal, newVal, config2);
      if (next !== curVal) {
        liveList.set(i, next);
      }
    } else if (curVal !== newVal) {
      liveList.set(i, deepLiveify(newVal, config2));
    }
  }
  for (let i = curLen; i < newLen; i++) {
    liveList.push(deepLiveify(jsonArr[i], config2));
  }
  for (let i = curLen - 1; i >= newLen; i--) {
    liveList.delete(i);
  }
  return liveList;
}
__name(reconcileLiveList, "reconcileLiveList");
var MAX_LIVE_OBJECT_SIZE = 128 * 1024;
var LiveObject = class _LiveObject extends AbstractCrdt {
  static {
    __name(this, "_LiveObject");
  }
  #synced;
  #local = /* @__PURE__ */ new Map();
  /**
   * Tracks unacknowledged local changes per property to preserve optimistic
   * updates. Maps property keys to their pending operation IDs.
   *
   * INVARIANT: Only locally-generated opIds are ever stored here. Remote opIds
   * are only compared against (to detect ACKs), never stored.
   *
   * When a local change is made, the opId is stored here. When a remote op
   * arrives for the same key:
   * - If no entry exists → apply remote op
   * - If opId matches → it's an ACK, clear the entry
   * - If opId differs → ignore remote op to preserve optimistic update
   */
  #unackedOpsByKey;
  /**
   * Enable or disable detection of too large LiveObjects.
   * When enabled, throws an error if LiveObject static data exceeds 128KB, which
   * is the maximum value the server will be able to accept.
   * By default, this behavior is disabled to avoid the runtime performance
   * overhead on every LiveObject.set() or LiveObject.update() call.
   *
   * @experimental
   */
  static detectLargeObjects = false;
  static #buildRootAndParentToChildren(nodes) {
    const parentToChildren = /* @__PURE__ */ new Map();
    let root = null;
    for (const node of nodes) {
      if (isRootStorageNode(node)) {
        root = node[1];
      } else {
        const crdt = node[1];
        const children = parentToChildren.get(crdt.parentId);
        if (children !== void 0) {
          children.push(node);
        } else {
          parentToChildren.set(crdt.parentId, [node]);
        }
      }
    }
    if (root === null) {
      throw new Error("Root can't be null");
    }
    return [root, parentToChildren];
  }
  /** @private Do not use this API directly */
  static _fromItems(nodes, pool) {
    const [root, parentToChildren] = _LiveObject.#buildRootAndParentToChildren(nodes);
    return _LiveObject._deserialize(
      ["root", root],
      parentToChildren,
      pool
    );
  }
  constructor(obj = {}) {
    super();
    this.#unackedOpsByKey = /* @__PURE__ */ new Map();
    const o = compactObject(obj);
    for (const key of Object.keys(o)) {
      const value = o[key];
      if (isLiveNode(value)) {
        value._setParentLink(this, key);
      }
    }
    this.#synced = new Map(Object.entries(o));
  }
  /** @internal */
  _toOps(parentId, parentKey) {
    if (this._id === void 0) {
      throw new Error("Cannot serialize item is not attached");
    }
    const ops = [];
    const op = {
      type: OpCode.CREATE_OBJECT,
      id: this._id,
      parentId,
      parentKey,
      data: {}
    };
    ops.push(op);
    for (const [key, value] of this.#synced) {
      if (isLiveNode(value)) {
        for (const childOp of value._toOps(this._id, key)) {
          ops.push(childOp);
        }
      } else {
        op.data[key] = value;
      }
    }
    return ops;
  }
  /** @internal */
  static _deserialize([id, item], parentToChildren, pool) {
    const liveObj = new _LiveObject(item.data);
    liveObj._attach(id, pool);
    return this._deserializeChildren(liveObj, parentToChildren, pool);
  }
  /** @internal */
  static _deserializeChildren(liveObj, parentToChildren, pool) {
    const children = parentToChildren.get(nn(liveObj._id));
    if (children === void 0) {
      return liveObj;
    }
    for (const node of children) {
      const child = deserializeToLson(node, parentToChildren, pool);
      const crdt = node[1];
      if (isLiveStructure(child)) {
        child._setParentLink(liveObj, crdt.parentKey);
      }
      liveObj.#synced.set(crdt.parentKey, child);
      liveObj.invalidate();
    }
    return liveObj;
  }
  /** @internal */
  _attach(id, pool) {
    super._attach(id, pool);
    for (const [_key, value] of this.#synced) {
      if (isLiveNode(value)) {
        value._attach(pool.generateId(), pool);
      }
    }
  }
  /** @internal */
  _attachChild(op, source) {
    if (this._pool === void 0) {
      throw new Error("Can't attach child if managed pool is not present");
    }
    const { id, opId, parentKey: key } = op;
    const child = creationOpToLson(op);
    if (this._pool.getNode(id) !== void 0) {
      if (this.#unackedOpsByKey.get(key) === opId) {
        this.#unackedOpsByKey.delete(key);
      }
      return { modified: false };
    }
    if (source === 0) {
      this.#unackedOpsByKey.set(key, nn(opId));
    } else if (this.#unackedOpsByKey.get(key) === void 0) {
    } else if (this.#unackedOpsByKey.get(key) === opId) {
      this.#unackedOpsByKey.delete(key);
      return { modified: false };
    } else {
      return { modified: false };
    }
    const thisId = nn(this._id);
    const previousValue = this.#synced.get(key);
    let reverse;
    if (isLiveNode(previousValue)) {
      reverse = previousValue._toOps(thisId, key);
      previousValue._detach();
    } else if (previousValue === void 0) {
      reverse = [{ type: OpCode.DELETE_OBJECT_KEY, id: thisId, key }];
    } else {
      reverse = [
        {
          type: OpCode.UPDATE_OBJECT,
          id: thisId,
          data: { [key]: previousValue }
        }
      ];
    }
    this.#local.delete(key);
    this.#synced.set(key, child);
    this.invalidate();
    if (isLiveStructure(child)) {
      child._setParentLink(this, key);
      child._attach(id, this._pool);
    }
    return {
      reverse,
      modified: {
        node: this,
        type: "LiveObject",
        updates: { [key]: { type: "update" } }
      }
    };
  }
  /** @internal */
  _detachChild(child) {
    if (child) {
      const id = nn(this._id);
      const parentKey = nn(child._parentKey);
      const reverse = child._toOps(id, parentKey);
      for (const [key, value] of this.#synced) {
        if (value === child) {
          this.#synced.delete(key);
          this.invalidate();
        }
      }
      child._detach();
      const storageUpdate = {
        node: this,
        type: "LiveObject",
        updates: {
          [parentKey]: { type: "delete" }
        }
      };
      return { modified: storageUpdate, reverse };
    }
    return { modified: false };
  }
  /** @internal */
  _detach() {
    super._detach();
    for (const value of this.#synced.values()) {
      if (isLiveNode(value)) {
        value._detach();
      }
    }
  }
  /** @internal */
  _apply(op, isLocal) {
    if (op.type === OpCode.UPDATE_OBJECT) {
      return this.#applyUpdate(op, isLocal);
    } else if (op.type === OpCode.DELETE_OBJECT_KEY) {
      return this.#applyDeleteObjectKey(op, isLocal);
    }
    return super._apply(op, isLocal);
  }
  /** @internal */
  _serialize() {
    const data = {};
    for (const [key, value] of this.#synced) {
      if (!isLiveNode(value)) {
        data[key] = value;
      }
    }
    if (this.parent.type === "HasParent" && this.parent.node._id) {
      return {
        type: CrdtType.OBJECT,
        parentId: this.parent.node._id,
        parentKey: this.parent.key,
        data
      };
    } else {
      return {
        type: CrdtType.OBJECT,
        data
      };
    }
  }
  #applyUpdate(op, isLocal) {
    let isModified = false;
    const id = nn(this._id);
    const reverse = [];
    const reverseUpdate = {
      type: OpCode.UPDATE_OBJECT,
      id,
      data: {}
    };
    for (const key in op.data) {
      const oldValue = this.#synced.get(key);
      if (isLiveNode(oldValue)) {
        for (const childOp of oldValue._toOps(id, key)) {
          reverse.push(childOp);
        }
        oldValue._detach();
      } else if (oldValue !== void 0) {
        reverseUpdate.data[key] = oldValue;
      } else if (oldValue === void 0) {
        reverse.push({ type: OpCode.DELETE_OBJECT_KEY, id, key });
      }
    }
    const updateDelta = {};
    for (const key in op.data) {
      const value = op.data[key];
      if (value === void 0) {
        continue;
      }
      if (isLocal) {
        this.#unackedOpsByKey.set(key, nn(op.opId));
      } else if (this.#unackedOpsByKey.get(key) === void 0) {
        isModified = true;
      } else if (this.#unackedOpsByKey.get(key) === op.opId) {
        this.#unackedOpsByKey.delete(key);
        continue;
      } else {
        continue;
      }
      const oldValue = this.#synced.get(key);
      if (isLiveNode(oldValue)) {
        oldValue._detach();
      }
      isModified = true;
      updateDelta[key] = { type: "update" };
      this.#local.delete(key);
      this.#synced.set(key, value);
      this.invalidate();
    }
    if (Object.keys(reverseUpdate.data).length !== 0) {
      reverse.unshift(reverseUpdate);
    }
    return isModified ? {
      modified: {
        node: this,
        type: "LiveObject",
        updates: updateDelta
      },
      reverse
    } : { modified: false };
  }
  #applyDeleteObjectKey(op, isLocal) {
    const key = op.key;
    const oldValue = this.#synced.get(key);
    if (oldValue === void 0) {
      return { modified: false };
    }
    if (!isLocal && this.#unackedOpsByKey.get(key) !== void 0) {
      return { modified: false };
    }
    const id = nn(this._id);
    let reverse = [];
    if (isLiveNode(oldValue)) {
      reverse = oldValue._toOps(id, op.key);
      oldValue._detach();
    } else if (oldValue !== void 0) {
      reverse = [
        {
          type: OpCode.UPDATE_OBJECT,
          id,
          data: { [key]: oldValue }
        }
      ];
    }
    this.#local.delete(key);
    this.#synced.delete(key);
    this.invalidate();
    return {
      modified: {
        node: this,
        type: "LiveObject",
        updates: {
          [op.key]: { type: "delete", deletedItem: oldValue }
        }
      },
      reverse
    };
  }
  /** @private */
  keys() {
    const result = new Set(this.#synced.keys());
    for (const key of this.#local.keys()) {
      result.add(key);
    }
    return result;
  }
  /**
   * Adds or updates a property with a specified key and a value.
   * @param key The key of the property to add
   * @param value The value of the property to add
   */
  set(key, value) {
    this.update({ [key]: value });
  }
  /**
   * @experimental
   *
   * Sets a local-only property that is not synchronized over the wire. The
   * value will be visible via get(), and toJSON() on this client only. Other
   * clients and the server will see `undefined` for this key.
   *
   * Caveat: this method will not add changes to the undo/redo stack.
   */
  setLocal(key, value) {
    this._pool?.assertStorageIsWritable();
    const deleteResult = this.#prepareDelete(key);
    this.#local.set(key, value);
    this.invalidate();
    if (this._pool !== void 0 && this._id !== void 0) {
      const ops = deleteResult?.[0] ?? [];
      const reverse = deleteResult?.[1] ?? [];
      const storageUpdates = deleteResult?.[2] ?? /* @__PURE__ */ new Map();
      const existing = storageUpdates.get(this._id);
      storageUpdates.set(this._id, {
        node: this,
        type: "LiveObject",
        updates: {
          ...existing?.updates,
          [key]: { type: "update" }
        }
      });
      this._pool.dispatch(ops, reverse, storageUpdates);
    }
  }
  /**
   * Returns a specified property from the LiveObject.
   * @param key The key of the property to get
   */
  get(key) {
    return this.#local.has(key) ? this.#local.get(key) : this.#synced.get(key);
  }
  /**
   * Removes a synced key, returning the ops, reverse ops, and storage updates
   * needed to notify the pool. Returns null if the key doesn't exist in
   * #synced or pool/id are unavailable. Does NOT dispatch.
   */
  #prepareDelete(key) {
    this._pool?.assertStorageIsWritable();
    const k = key;
    if (this.#local.has(k) && !this.#synced.has(k)) {
      const oldValue2 = this.#local.get(k);
      this.#local.delete(k);
      this.invalidate();
      if (this._pool !== void 0 && this._id !== void 0) {
        const storageUpdates2 = /* @__PURE__ */ new Map();
        storageUpdates2.set(this._id, {
          node: this,
          type: "LiveObject",
          updates: {
            [k]: {
              type: "delete",
              deletedItem: oldValue2
            }
          }
        });
        return [[], [], storageUpdates2];
      }
      return null;
    }
    this.#local.delete(k);
    const oldValue = this.#synced.get(k);
    if (oldValue === void 0) {
      return null;
    }
    if (this._pool === void 0 || this._id === void 0) {
      if (isLiveNode(oldValue)) {
        oldValue._detach();
      }
      this.#synced.delete(k);
      this.invalidate();
      return null;
    }
    const ops = [
      {
        type: OpCode.DELETE_OBJECT_KEY,
        key: k,
        id: this._id,
        opId: this._pool.generateOpId()
      }
    ];
    let reverse;
    if (isLiveNode(oldValue)) {
      oldValue._detach();
      reverse = oldValue._toOps(this._id, k);
    } else {
      reverse = [
        {
          type: OpCode.UPDATE_OBJECT,
          data: { [k]: oldValue },
          id: this._id
        }
      ];
    }
    this.#synced.delete(k);
    this.invalidate();
    const storageUpdates = /* @__PURE__ */ new Map();
    storageUpdates.set(this._id, {
      node: this,
      type: "LiveObject",
      updates: {
        [key]: { type: "delete", deletedItem: oldValue }
      }
    });
    return [ops, reverse, storageUpdates];
  }
  /**
   * Deletes a key from the LiveObject
   * @param key The key of the property to delete
   */
  delete(key) {
    const result = this.#prepareDelete(key);
    if (result) {
      const [ops, reverse, storageUpdates] = result;
      this._pool?.dispatch(ops, reverse, storageUpdates);
    }
  }
  /**
   * Adds or updates multiple properties at once with an object.
   * @param patch The object used to overrides properties
   */
  update(patch) {
    this._pool?.assertStorageIsWritable();
    if (_LiveObject.detectLargeObjects) {
      const data = {};
      for (const [key, value] of this.#synced) {
        if (!isLiveNode(value)) {
          data[key] = value;
        }
      }
      for (const key of Object.keys(patch)) {
        const value = patch[key];
        if (value === void 0) continue;
        if (!isLiveNode(value)) {
          data[key] = value;
        }
      }
      const jsonString = JSON.stringify(data);
      const upperBoundSize = jsonString.length * 4;
      if (upperBoundSize > MAX_LIVE_OBJECT_SIZE) {
        const preciseSize = new TextEncoder().encode(jsonString).length;
        if (preciseSize > MAX_LIVE_OBJECT_SIZE) {
          throw new Error(
            `LiveObject size exceeded limit: ${preciseSize} bytes > ${MAX_LIVE_OBJECT_SIZE} bytes. See https://liveblocks.io/docs/platform/limits#Liveblocks-Storage-limits`
          );
        }
      }
    }
    if (this._pool === void 0 || this._id === void 0) {
      for (const key in patch) {
        const newValue = patch[key];
        if (newValue === void 0) {
          continue;
        }
        const oldValue = this.#synced.get(key);
        if (isLiveNode(oldValue)) {
          oldValue._detach();
        }
        if (isLiveNode(newValue)) {
          newValue._setParentLink(this, key);
        }
        this.#local.delete(key);
        this.#synced.set(key, newValue);
        this.invalidate();
      }
      return;
    }
    const ops = [];
    const reverseOps = [];
    const opId = this._pool.generateOpId();
    const updatedProps = {};
    const reverseUpdateOp = {
      id: this._id,
      type: OpCode.UPDATE_OBJECT,
      data: {}
    };
    const updateDelta = {};
    for (const key in patch) {
      const newValue = patch[key];
      if (newValue === void 0) {
        continue;
      }
      const oldValue = this.#synced.get(key);
      if (oldValue === newValue) {
        continue;
      }
      if (isLiveNode(oldValue)) {
        for (const childOp of oldValue._toOps(this._id, key)) {
          reverseOps.push(childOp);
        }
        oldValue._detach();
      } else if (oldValue === void 0) {
        reverseOps.push({ type: OpCode.DELETE_OBJECT_KEY, id: this._id, key });
      } else {
        reverseUpdateOp.data[key] = oldValue;
      }
      if (isLiveNode(newValue)) {
        newValue._setParentLink(this, key);
        newValue._attach(this._pool.generateId(), this._pool);
        const newAttachChildOps = newValue._toOpsWithOpId(
          this._id,
          key,
          this._pool
        );
        const createCrdtOp = newAttachChildOps.find(
          (op) => op.parentId === this._id
        );
        if (createCrdtOp) {
          this.#unackedOpsByKey.set(key, nn(createCrdtOp.opId));
        }
        for (const childOp of newAttachChildOps) {
          ops.push(childOp);
        }
      } else {
        updatedProps[key] = newValue;
        this.#unackedOpsByKey.set(key, opId);
      }
      this.#local.delete(key);
      this.#synced.set(key, newValue);
      this.invalidate();
      updateDelta[key] = { type: "update" };
    }
    if (Object.keys(reverseUpdateOp.data).length !== 0) {
      reverseOps.unshift(reverseUpdateOp);
    }
    if (Object.keys(updatedProps).length !== 0) {
      ops.unshift({
        opId,
        id: this._id,
        type: OpCode.UPDATE_OBJECT,
        data: updatedProps
      });
    }
    if (ops.length === 0 && reverseOps.length === 0 && Object.keys(updateDelta).length === 0) {
      return;
    }
    const storageUpdates = /* @__PURE__ */ new Map();
    storageUpdates.set(this._id, {
      node: this,
      type: "LiveObject",
      updates: updateDelta
    });
    this._pool.dispatch(ops, reverseOps, storageUpdates);
  }
  static from(obj, config2) {
    if (!isPlainObject2(obj)) throw new Error("Expected a JSON object");
    const liveObj = new _LiveObject({});
    liveObj.reconcile(obj, config2);
    return liveObj;
  }
  reconcile(jsonObj, config2) {
    if (this.hasCache(jsonObj)) return;
    if (!isPlainObject2(jsonObj))
      throw new Error(
        "Reconciling the document root expects a plain object value"
      );
    reconcileLiveObject(this, jsonObj, "full", config2);
  }
  /**
   * Like reconcile(), but only touches the top-level keys present in
   * `partialObj`. Keys on this LiveObject that are absent from `partialObj`
   * are left untouched. Typically called on the storage root when
   * reconciling a subset of keys without affecting other keys on the root.
   *
   * Note: the partial behavior only applies to the top-level keys of this
   * object. Nested structures are always fully reconciled.
   *
   * @private
   */
  reconcilePartially(partialObj, config2) {
    if (!isPlainObject2(partialObj))
      throw new Error(
        "Reconciling the document root expects a plain object value"
      );
    reconcileLiveObject(this, partialObj, "partial", config2);
  }
  /** @internal */
  toTreeNode(key) {
    return super.toTreeNode(key);
  }
  /** @internal */
  _toTreeNode(key) {
    const nodeId = this._id ?? nanoid3();
    return {
      type: "LiveObject",
      id: nodeId,
      key,
      payload: Array.from(this.#synced.entries()).map(
        ([key2, value]) => isLiveNode(value) ? value.toTreeNode(key2) : { type: "Json", id: `${nodeId}:${key2}`, key: key2, payload: value }
      )
    };
  }
  toJSON() {
    return super.toJSON();
  }
  /** @internal */
  _toJSON() {
    const result = {};
    for (const [key, val] of this.#synced) {
      result[key] = isLiveStructure(val) ? val.toJSON() : val;
    }
    for (const [key, val] of this.#local) {
      result[key] = val;
    }
    return freeze(result);
  }
  clone() {
    const cloned = new _LiveObject(
      Object.fromEntries(
        Array.from(this.#synced).map(([key, value]) => [
          key,
          isLiveStructure(value) ? value.clone() : deepClone(value)
        ])
      )
    );
    for (const [key, value] of this.#local) {
      cloned.#local.set(key, deepClone(value));
    }
    return cloned;
  }
};
function creationOpToLiveNode(op) {
  return lsonToLiveNode(creationOpToLson(op));
}
__name(creationOpToLiveNode, "creationOpToLiveNode");
function creationOpToLson(op) {
  switch (op.type) {
    case OpCode.CREATE_REGISTER:
      return op.data;
    case OpCode.CREATE_OBJECT:
      return new LiveObject(op.data);
    case OpCode.CREATE_MAP:
      return new LiveMap();
    case OpCode.CREATE_LIST:
      return new LiveList([]);
    default:
      return assertNever2(op, "Unknown creation Op");
  }
}
__name(creationOpToLson, "creationOpToLson");
function deserialize(node, parentToChildren, pool) {
  if (isObjectStorageNode(node)) {
    return LiveObject._deserialize(node, parentToChildren, pool);
  } else if (isListStorageNode(node)) {
    return LiveList._deserialize(node, parentToChildren, pool);
  } else if (isMapStorageNode(node)) {
    return LiveMap._deserialize(node, parentToChildren, pool);
  } else if (isRegisterStorageNode(node)) {
    return LiveRegister._deserialize(node, parentToChildren, pool);
  } else {
    throw new Error("Unexpected CRDT type");
  }
}
__name(deserialize, "deserialize");
function deserializeToLson(node, parentToChildren, pool) {
  if (isObjectStorageNode(node)) {
    return LiveObject._deserialize(node, parentToChildren, pool);
  } else if (isListStorageNode(node)) {
    return LiveList._deserialize(node, parentToChildren, pool);
  } else if (isMapStorageNode(node)) {
    return LiveMap._deserialize(node, parentToChildren, pool);
  } else if (isRegisterStorageNode(node)) {
    return node[1].data;
  } else {
    throw new Error("Unexpected CRDT type");
  }
}
__name(deserializeToLson, "deserializeToLson");
function isLiveStructure(value) {
  return isLiveList(value) || isLiveMap(value) || isLiveObject(value);
}
__name(isLiveStructure, "isLiveStructure");
function isLiveNode(value) {
  return isLiveStructure(value) || isLiveRegister(value);
}
__name(isLiveNode, "isLiveNode");
function isLiveList(value) {
  return value instanceof LiveList;
}
__name(isLiveList, "isLiveList");
function isLiveMap(value) {
  return value instanceof LiveMap;
}
__name(isLiveMap, "isLiveMap");
function isLiveObject(value) {
  return value instanceof LiveObject;
}
__name(isLiveObject, "isLiveObject");
function isLiveRegister(value) {
  return value instanceof LiveRegister;
}
__name(isLiveRegister, "isLiveRegister");
function liveNodeToLson(obj) {
  if (obj instanceof LiveRegister) {
    return obj.data;
  } else if (obj instanceof LiveList || obj instanceof LiveMap || obj instanceof LiveObject) {
    return obj;
  } else {
    return assertNever2(obj, "Unknown AbstractCrdt");
  }
}
__name(liveNodeToLson, "liveNodeToLson");
function lsonToLiveNode(value) {
  if (value instanceof LiveObject || value instanceof LiveMap || value instanceof LiveList) {
    return value;
  } else {
    return new LiveRegister(value);
  }
}
__name(lsonToLiveNode, "lsonToLiveNode");
var eventSource = makeEventSource();
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  window.addEventListener("message", (event) => {
    if (event.source === window && event.data?.source === "liveblocks-devtools-panel") {
      eventSource.notify(event.data);
    } else {
    }
  });
}
var onMessageFromPanel = eventSource.observable;
var loadedAt = Date.now();
var kPlain = /* @__PURE__ */ Symbol("notification-settings-plain");
function createNotificationSettings(plain) {
  const channels = [
    "email",
    "slack",
    "teams",
    "webPush"
  ];
  const descriptors = {
    [kPlain]: {
      value: plain,
      enumerable: false
    }
  };
  for (const channel of channels) {
    descriptors[channel] = {
      enumerable: true,
      /**
       * In the TypeScript standard library definitions, the built-in interface for a property descriptor
       * does not include a specialized type for the “this” context in the getter or setter functions.
       * As a result, both the ⁠get and ⁠set methods implicitly have ⁠this: any.
       * The reason is that property descriptors in JavaScript are used across various objects with
       * no enforced shape for ⁠this. And so the standard library definitions have to remain as broad as possible
       * to support any valid JavaScript usage (e.g `Object.defineProperty`).
       *
       * So we can safely tells that this getter is typed as `this: NotificationSettings` because we're
       * creating a well known shaped object → `NotificationSettings`.
       */
      get() {
        const value = this[kPlain][channel];
        if (typeof value === "undefined") {
          error210(
            `In order to use the '${channel}' channel, please set up your project first. For more information: https://liveblocks.io/docs/errors/enable-a-notification-channel`
          );
          return null;
        }
        return value;
      }
    };
  }
  return create(null, descriptors);
}
__name(createNotificationSettings, "createNotificationSettings");
var ClientMsgCode = Object.freeze({
  // For Presence
  UPDATE_PRESENCE: 100,
  BROADCAST_EVENT: 103,
  // For Storage
  FETCH_STORAGE: 200,
  UPDATE_STORAGE: 201,
  // For Yjs support
  FETCH_YDOC: 300,
  UPDATE_YDOC: 301,
  // For Feeds
  FETCH_FEEDS: 510,
  FETCH_FEED_MESSAGES: 511,
  ADD_FEED: 512,
  UPDATE_FEED: 513,
  DELETE_FEED: 514,
  ADD_FEED_MESSAGE: 515,
  UPDATE_FEED_MESSAGE: 516,
  DELETE_FEED_MESSAGE: 517
});
function checkBounds(option, value, min, max, recommendedMin) {
  if (typeof value !== "number" || value < min || max !== void 0 && value > max) {
    throw new Error(
      max !== void 0 ? `${option} should be between ${recommendedMin ?? min} and ${max}.` : `${option} should be at least ${recommendedMin ?? min}.`
    );
  }
  return value;
}
__name(checkBounds, "checkBounds");
var htmlEscapables = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var htmlEscapablesRegex = new RegExp(
  Object.keys(htmlEscapables).map((entity) => `\\${entity}`).join("|"),
  "g"
);
var markdownEscapables = {
  _: "\\_",
  "*": "\\*",
  "#": "\\#",
  "`": "\\`",
  "~": "\\~",
  "!": "\\!",
  "|": "\\|",
  "(": "\\(",
  ")": "\\)",
  "{": "\\{",
  "}": "\\}",
  "[": "\\[",
  "]": "\\]"
};
var markdownEscapablesRegex = new RegExp(
  Object.keys(markdownEscapables).map((entity) => `\\${entity}`).join("|"),
  "g"
);
function makeAbortController(externalSignal) {
  const ctl = new AbortController();
  return {
    signal: externalSignal ? AbortSignal.any([ctl.signal, externalSignal]) : ctl.signal,
    abort: ctl.abort.bind(ctl)
  };
}
__name(makeAbortController, "makeAbortController");
detectDupes(PKG_NAME, PKG_VERSION, PKG_FORMAT);

// node_modules/@liveblocks/node/dist/index.js
init_esm();

// node_modules/marked/lib/marked.esm.js
init_esm();
function _getDefaults() {
  return {
    async: false,
    breaks: false,
    extensions: null,
    gfm: true,
    hooks: null,
    pedantic: false,
    renderer: null,
    silent: false,
    tokenizer: null,
    walkTokens: null
  };
}
__name(_getDefaults, "_getDefaults");
var _defaults = _getDefaults();
function changeDefaults(newDefaults) {
  _defaults = newDefaults;
}
__name(changeDefaults, "changeDefaults");
var noopTest = { exec: /* @__PURE__ */ __name(() => null, "exec") };
function edit(regex, opt = "") {
  let source = typeof regex === "string" ? regex : regex.source;
  const obj = {
    replace: /* @__PURE__ */ __name((name, val) => {
      let valSource = typeof val === "string" ? val : val.source;
      valSource = valSource.replace(other.caret, "$1");
      source = source.replace(name, valSource);
      return obj;
    }, "replace"),
    getRegex: /* @__PURE__ */ __name(() => {
      return new RegExp(source, opt);
    }, "getRegex")
  };
  return obj;
}
__name(edit, "edit");
var other = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: /* @__PURE__ */ __name((bull) => new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`), "listItemRegex"),
  nextBulletRegex: /* @__PURE__ */ __name((indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), "nextBulletRegex"),
  hrRegex: /* @__PURE__ */ __name((indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), "hrRegex"),
  fencesBeginRegex: /* @__PURE__ */ __name((indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`), "fencesBeginRegex"),
  headingBeginRegex: /* @__PURE__ */ __name((indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`), "headingBeginRegex"),
  htmlBeginRegex: /* @__PURE__ */ __name((indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, "i"), "htmlBeginRegex")
};
var newline = /^(?:[ \t]*(?:\n|$))+/;
var blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var bullet = /(?:[*+-]|\d{1,9}[.)])/;
var lheadingCore = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var lheading = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var lheadingGfm = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var blockText = /^[^\n]+/;
var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
var def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var html = edit(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
var blockNormal = {
  blockquote,
  code: blockCode,
  def,
  fences,
  heading,
  hr,
  html,
  lheading,
  list,
  newline,
  paragraph,
  table: noopTest,
  text: blockText
};
var gfmTable = edit(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockGfm = {
  ...blockNormal,
  lheading: lheadingGfm,
  table: gfmTable,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
};
var blockPedantic = {
  ...blockNormal,
  html: edit(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
};
var escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var br = /^( {2,}|\\)\n(?!\s*$)/;
var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var _punctuation = /[\p{P}\p{S}]/u;
var _punctuationOrSpace = /[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpace = /[^\s\p{P}\p{S}]/u;
var punctuation = edit(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, _punctuationOrSpace).getRegex();
var _punctuationGfmStrongEm = /(?!~)[\p{P}\p{S}]/u;
var _punctuationOrSpaceGfmStrongEm = /(?!~)[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpaceGfmStrongEm = /(?:[^\s\p{P}\p{S}]|~)/u;
var blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
var emStrongLDelimCore = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var emStrongLDelim = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuation).getRegex();
var emStrongLDelimGfm = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimAstCore = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var emStrongRDelimAst = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var emStrongRDelimAstGfm = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpaceGfmStrongEm).replace(/punctSpace/g, _punctuationOrSpaceGfmStrongEm).replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimUnd = edit(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var anyPunctuation = edit(/\\(punct)/, "gu").replace(/punct/g, _punctuation).getRegex();
var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
var tag = edit(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
var link = edit(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
var reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
var inlineNormal = {
  _backpedal: noopTest,
  // only used for GFM url
  anyPunctuation,
  autolink,
  blockSkip,
  br,
  code: inlineCode,
  del: noopTest,
  emStrongLDelim,
  emStrongRDelimAst,
  emStrongRDelimUnd,
  escape,
  link,
  nolink,
  punctuation,
  reflink,
  reflinkSearch,
  tag,
  text: inlineText,
  url: noopTest
};
var inlinePedantic = {
  ...inlineNormal,
  link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
};
var inlineGfm = {
  ...inlineNormal,
  emStrongRDelimAst: emStrongRDelimAstGfm,
  emStrongLDelim: emStrongLDelimGfm,
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
var inlineBreaks = {
  ...inlineGfm,
  br: edit(br).replace("{2,}", "*").getRegex(),
  text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
var block = {
  normal: blockNormal,
  gfm: blockGfm,
  pedantic: blockPedantic
};
var inline = {
  normal: inlineNormal,
  gfm: inlineGfm,
  breaks: inlineBreaks,
  pedantic: inlinePedantic
};
var escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var getEscapeReplacement = /* @__PURE__ */ __name((ch) => escapeReplacements[ch], "getEscapeReplacement");
function escape2(html2, encode4) {
  if (encode4) {
    if (other.escapeTest.test(html2)) {
      return html2.replace(other.escapeReplace, getEscapeReplacement);
    }
  } else {
    if (other.escapeTestNoEncode.test(html2)) {
      return html2.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html2;
}
__name(escape2, "escape2");
function cleanUrl(href) {
  try {
    href = encodeURI(href).replace(other.percentDecode, "%");
  } catch {
    return null;
  }
  return href;
}
__name(cleanUrl, "cleanUrl");
function splitCells(tableRow, count) {
  const row = tableRow.replace(other.findPipe, (match, offset, str) => {
    let escaped = false;
    let curr = offset;
    while (--curr >= 0 && str[curr] === "\\") escaped = !escaped;
    if (escaped) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(other.splitPipe);
  let i = 0;
  if (!cells[0].trim()) {
    cells.shift();
  }
  if (cells.length > 0 && !cells.at(-1)?.trim()) {
    cells.pop();
  }
  if (count) {
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) cells.push("");
    }
  }
  for (; i < cells.length; i++) {
    cells[i] = cells[i].trim().replace(other.slashPipe, "|");
  }
  return cells;
}
__name(splitCells, "splitCells");
function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return "";
  }
  let suffLen = 0;
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.slice(0, l - suffLen);
}
__name(rtrim, "rtrim");
function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  let level = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\\") {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  if (level > 0) {
    return -2;
  }
  return -1;
}
__name(findClosingBracket, "findClosingBracket");
function outputLink(cap, link2, raw, lexer2, rules) {
  const href = link2.href;
  const title = link2.title || null;
  const text = cap[1].replace(rules.other.outputLinkReplace, "$1");
  lexer2.state.inLink = true;
  const token = {
    type: cap[0].charAt(0) === "!" ? "image" : "link",
    raw,
    href,
    title,
    text,
    tokens: lexer2.inlineTokens(text)
  };
  lexer2.state.inLink = false;
  return token;
}
__name(outputLink, "outputLink");
function indentCodeCompensation(raw, text, rules) {
  const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
  if (matchIndentToCode === null) {
    return text;
  }
  const indentToCode = matchIndentToCode[1];
  return text.split("\n").map((node) => {
    const matchIndentInNode = node.match(rules.other.beginningSpace);
    if (matchIndentInNode === null) {
      return node;
    }
    const [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length) {
      return node.slice(indentToCode.length);
    }
    return node;
  }).join("\n");
}
__name(indentCodeCompensation, "indentCodeCompensation");
var _Tokenizer = class {
  static {
    __name(this, "_Tokenizer");
  }
  options;
  rules;
  // set by the lexer
  lexer;
  // set by the lexer
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: "space",
        raw: cap[0]
      };
    }
  }
  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text, "\n") : text
      };
    }
  }
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || "", this.rules);
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
        text
      };
    }
  }
  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();
      if (this.rules.other.endingHash.test(text)) {
        const trimmed = rtrim(text, "#");
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) {
          text = trimmed.trim();
        }
      }
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: rtrim(cap[0], "\n")
      };
    }
  }
  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      let lines = rtrim(cap[0], "\n").split("\n");
      let raw = "";
      let text = "";
      const tokens = [];
      while (lines.length > 0) {
        let inBlockquote = false;
        const currentLines = [];
        let i;
        for (i = 0; i < lines.length; i++) {
          if (this.rules.other.blockquoteStart.test(lines[i])) {
            currentLines.push(lines[i]);
            inBlockquote = true;
          } else if (!inBlockquote) {
            currentLines.push(lines[i]);
          } else {
            break;
          }
        }
        lines = lines.slice(i);
        const currentRaw = currentLines.join("\n");
        const currentText = currentRaw.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
        raw = raw ? `${raw}
${currentRaw}` : currentRaw;
        text = text ? `${text}
${currentText}` : currentText;
        const top = this.lexer.state.top;
        this.lexer.state.top = true;
        this.lexer.blockTokens(currentText, tokens, true);
        this.lexer.state.top = top;
        if (lines.length === 0) {
          break;
        }
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "code") {
          break;
        } else if (lastToken?.type === "blockquote") {
          const oldToken = lastToken;
          const newText = oldToken.raw + "\n" + lines.join("\n");
          const newToken = this.blockquote(newText);
          tokens[tokens.length - 1] = newToken;
          raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
          text = text.substring(0, text.length - oldToken.text.length) + newToken.text;
          break;
        } else if (lastToken?.type === "list") {
          const oldToken = lastToken;
          const newText = oldToken.raw + "\n" + lines.join("\n");
          const newToken = this.list(newText);
          tokens[tokens.length - 1] = newToken;
          raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
          text = text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
          lines = newText.substring(tokens.at(-1).raw.length).split("\n");
          continue;
        }
      }
      return {
        type: "blockquote",
        raw,
        tokens,
        text
      };
    }
  }
  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let bull = cap[1].trim();
      const isordered = bull.length > 1;
      const list2 = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: []
      };
      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
      if (this.options.pedantic) {
        bull = isordered ? bull : "[*+-]";
      }
      const itemRegex = this.rules.other.listItemRegex(bull);
      let endsWithBlankLine = false;
      while (src) {
        let endEarly = false;
        let raw = "";
        let itemContents = "";
        if (!(cap = itemRegex.exec(src))) {
          break;
        }
        if (this.rules.block.hr.test(src)) {
          break;
        }
        raw = cap[0];
        src = src.substring(raw.length);
        let line = cap[2].split("\n", 1)[0].replace(this.rules.other.listReplaceTabs, (t) => " ".repeat(3 * t.length));
        let nextLine = src.split("\n", 1)[0];
        let blankLine = !line.trim();
        let indent = 0;
        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimStart();
        } else if (blankLine) {
          indent = cap[1].length + 1;
        } else {
          indent = cap[2].search(this.rules.other.nonSpaceChar);
          indent = indent > 4 ? 1 : indent;
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }
        if (blankLine && this.rules.other.blankLine.test(nextLine)) {
          raw += nextLine + "\n";
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }
        if (!endEarly) {
          const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
          const hrRegex = this.rules.other.hrRegex(indent);
          const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
          const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
          const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
          while (src) {
            const rawLine = src.split("\n", 1)[0];
            let nextLineWithoutTabs;
            nextLine = rawLine;
            if (this.options.pedantic) {
              nextLine = nextLine.replace(this.rules.other.listReplaceNesting, "  ");
              nextLineWithoutTabs = nextLine;
            } else {
              nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, "    ");
            }
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }
            if (headingBeginRegex.test(nextLine)) {
              break;
            }
            if (htmlBeginRegex.test(nextLine)) {
              break;
            }
            if (nextBulletRegex.test(nextLine)) {
              break;
            }
            if (hrRegex.test(nextLine)) {
              break;
            }
            if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) {
              itemContents += "\n" + nextLineWithoutTabs.slice(indent);
            } else {
              if (blankLine) {
                break;
              }
              if (line.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) {
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }
              itemContents += "\n" + nextLine;
            }
            if (!blankLine && !nextLine.trim()) {
              blankLine = true;
            }
            raw += rawLine + "\n";
            src = src.substring(rawLine.length + 1);
            line = nextLineWithoutTabs.slice(indent);
          }
        }
        if (!list2.loose) {
          if (endsWithBlankLine) {
            list2.loose = true;
          } else if (this.rules.other.doubleBlankLine.test(raw)) {
            endsWithBlankLine = true;
          }
        }
        let istask = null;
        let ischecked;
        if (this.options.gfm) {
          istask = this.rules.other.listIsTask.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== "[ ] ";
            itemContents = itemContents.replace(this.rules.other.listReplaceTask, "");
          }
        }
        list2.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents,
          tokens: []
        });
        list2.raw += raw;
      }
      const lastItem = list2.items.at(-1);
      if (lastItem) {
        lastItem.raw = lastItem.raw.trimEnd();
        lastItem.text = lastItem.text.trimEnd();
      } else {
        return;
      }
      list2.raw = list2.raw.trimEnd();
      for (let i = 0; i < list2.items.length; i++) {
        this.lexer.state.top = false;
        list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
        if (!list2.loose) {
          const spacers = list2.items[i].tokens.filter((t) => t.type === "space");
          const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t) => this.rules.other.anyLine.test(t.raw));
          list2.loose = hasMultipleLineBreaks;
        }
      }
      if (list2.loose) {
        for (let i = 0; i < list2.items.length; i++) {
          list2.items[i].loose = true;
        }
      }
      return list2;
    }
  }
  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: "html",
        block: true,
        raw: cap[0],
        pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
        text: cap[0]
      };
      return token;
    }
  }
  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      const tag2 = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " ");
      const href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
      const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
      return {
        type: "def",
        tag: tag2,
        raw: cap[0],
        href,
        title
      };
    }
  }
  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (!cap) {
      return;
    }
    if (!this.rules.other.tableDelimiter.test(cap[2])) {
      return;
    }
    const headers = splitCells(cap[1]);
    const aligns = cap[2].replace(this.rules.other.tableAlignChars, "").split("|");
    const rows = cap[3]?.trim() ? cap[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [];
    const item = {
      type: "table",
      raw: cap[0],
      header: [],
      align: [],
      rows: []
    };
    if (headers.length !== aligns.length) {
      return;
    }
    for (const align of aligns) {
      if (this.rules.other.tableAlignRight.test(align)) {
        item.align.push("right");
      } else if (this.rules.other.tableAlignCenter.test(align)) {
        item.align.push("center");
      } else if (this.rules.other.tableAlignLeft.test(align)) {
        item.align.push("left");
      } else {
        item.align.push(null);
      }
    }
    for (let i = 0; i < headers.length; i++) {
      item.header.push({
        text: headers[i],
        tokens: this.lexer.inline(headers[i]),
        header: true,
        align: item.align[i]
      });
    }
    for (const row of rows) {
      item.rows.push(splitCells(row, item.header.length).map((cell, i) => {
        return {
          text: cell,
          tokens: this.lexer.inline(cell),
          header: false,
          align: item.align[i]
        };
      }));
    }
    return item;
  }
  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }
  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
      return {
        type: "paragraph",
        raw: cap[0],
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }
  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: cap[1]
      };
    }
  }
  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }
      return {
        type: "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: false,
        text: cap[0]
      };
    }
  }
  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
        if (!this.rules.other.endAngleBracket.test(trimmedUrl)) {
          return;
        }
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex === -2) {
          return;
        }
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        const link2 = this.rules.other.pedanticHrefTitle.exec(href);
        if (link2) {
          href = link2[1];
          title = link2[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim();
      if (this.rules.other.startAngleBracket.test(href)) {
        if (this.options.pedantic && !this.rules.other.endAngleBracket.test(trimmedUrl)) {
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
        title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
      }, cap[0], this.lexer, this.rules);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      const linkString = (cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, " ");
      const link2 = links[linkString.toLowerCase()];
      if (!link2) {
        const text = cap[0].charAt(0);
        return {
          type: "text",
          raw: text,
          text
        };
      }
      return outputLink(cap, link2, cap[0], this.lexer, this.rules);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrongLDelim.exec(src);
    if (!match) return;
    if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric)) return;
    const nextChar = match[1] || match[2] || "";
    if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
      const lLength = [...match[0]].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
      const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      endReg.lastIndex = 0;
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
        if (!rDelim) continue;
        rLength = [...rDelim].length;
        if (match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        delimTotal -= rLength;
        if (delimTotal > 0) continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        const lastCharLength = [...match[0]][0].length;
        const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
        if (Math.min(lLength, rLength) % 2) {
          const text2 = raw.slice(1, -1);
          return {
            type: "em",
            raw,
            text: text2,
            tokens: this.lexer.inlineTokens(text2)
          };
        }
        const text = raw.slice(2, -2);
        return {
          type: "strong",
          raw,
          text,
          tokens: this.lexer.inlineTokens(text)
        };
      }
    }
  }
  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(this.rules.other.newLineCharGlobal, " ");
      const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text);
      const hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text) && this.rules.other.endingSpaceChar.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      return {
        type: "codespan",
        raw: cap[0],
        text
      };
    }
  }
  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0]
      };
    }
  }
  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }
  autolink(src) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === "@") {
        text = cap[1];
        href = "mailto:" + text;
      } else {
        text = cap[1];
        href = text;
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  url(src) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === "@") {
        text = cap[0];
        href = "mailto:" + text;
      } else {
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
        } while (prevCapZero !== cap[0]);
        text = cap[0];
        if (cap[1] === "www.") {
          href = "http://" + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  inlineText(src) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      const escaped = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        escaped
      };
    }
  }
};
var _Lexer = class __Lexer {
  static {
    __name(this, "__Lexer");
  }
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(options2) {
    this.tokens = [];
    this.tokens.links = /* @__PURE__ */ Object.create(null);
    this.options = options2 || _defaults;
    this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };
    const rules = {
      other,
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block,
      inline
    };
  }
  /**
   * Static Lex Method
   */
  static lex(src, options2) {
    const lexer2 = new __Lexer(options2);
    return lexer2.lex(src);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(src, options2) {
    const lexer2 = new __Lexer(options2);
    return lexer2.inlineTokens(src);
  }
  /**
   * Preprocessing
   */
  lex(src) {
    src = src.replace(other.carriageReturn, "\n");
    this.blockTokens(src, this.tokens);
    for (let i = 0; i < this.inlineQueue.length; i++) {
      const next = this.inlineQueue[i];
      this.inlineTokens(next.src, next.tokens);
    }
    this.inlineQueue = [];
    return this.tokens;
  }
  blockTokens(src, tokens = [], lastParagraphClipped = false) {
    if (this.options.pedantic) {
      src = src.replace(other.tabCharGlobal, "    ").replace(other.spaceLine, "");
    }
    while (src) {
      let token;
      if (this.options.extensions?.block?.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (token.raw.length === 1 && lastToken !== void 0) {
          lastToken.raw += "\n";
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "paragraph" || lastToken?.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.at(-1).src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "paragraph" || lastToken?.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.raw;
          this.inlineQueue.at(-1).src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      let cutSrc = src;
      if (this.options.extensions?.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        const lastToken = tokens.at(-1);
        if (lastParagraphClipped && lastToken?.type === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue.at(-1).src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue.at(-1).src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    this.state.top = true;
    return tokens;
  }
  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(src, tokens = []) {
    let maskedSrc = src;
    let match = null;
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    }
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }
    let keepPrevChar = false;
    let prevChar = "";
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;
      let token;
      if (this.options.extensions?.inline?.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (token.type === "text" && lastToken?.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (!this.state.inLink && (token = this.tokenizer.url(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      let cutSrc = src;
      if (this.options.extensions?.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
};
var _Renderer = class {
  static {
    __name(this, "_Renderer");
  }
  options;
  parser;
  // set by the parser
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  space(token) {
    return "";
  }
  code({ text, lang, escaped }) {
    const langString = (lang || "").match(other.notSpaceStart)?.[0];
    const code = text.replace(other.endingNewline, "") + "\n";
    if (!langString) {
      return "<pre><code>" + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
    }
    return '<pre><code class="language-' + escape2(langString) + '">' + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
  }
  blockquote({ tokens }) {
    const body = this.parser.parse(tokens);
    return `<blockquote>
${body}</blockquote>
`;
  }
  html({ text }) {
    return text;
  }
  heading({ tokens, depth }) {
    return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>
`;
  }
  hr(token) {
    return "<hr>\n";
  }
  list(token) {
    const ordered = token.ordered;
    const start = token.start;
    let body = "";
    for (let j = 0; j < token.items.length; j++) {
      const item = token.items[j];
      body += this.listitem(item);
    }
    const type = ordered ? "ol" : "ul";
    const startAttr = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startAttr + ">\n" + body + "</" + type + ">\n";
  }
  listitem(item) {
    let itemBody = "";
    if (item.task) {
      const checkbox = this.checkbox({ checked: !!item.checked });
      if (item.loose) {
        if (item.tokens[0]?.type === "paragraph") {
          item.tokens[0].text = checkbox + " " + item.tokens[0].text;
          if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
            item.tokens[0].tokens[0].text = checkbox + " " + escape2(item.tokens[0].tokens[0].text);
            item.tokens[0].tokens[0].escaped = true;
          }
        } else {
          item.tokens.unshift({
            type: "text",
            raw: checkbox + " ",
            text: checkbox + " ",
            escaped: true
          });
        }
      } else {
        itemBody += checkbox + " ";
      }
    }
    itemBody += this.parser.parse(item.tokens, !!item.loose);
    return `<li>${itemBody}</li>
`;
  }
  checkbox({ checked }) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens }) {
    return `<p>${this.parser.parseInline(tokens)}</p>
`;
  }
  table(token) {
    let header = "";
    let cell = "";
    for (let j = 0; j < token.header.length; j++) {
      cell += this.tablecell(token.header[j]);
    }
    header += this.tablerow({ text: cell });
    let body = "";
    for (let j = 0; j < token.rows.length; j++) {
      const row = token.rows[j];
      cell = "";
      for (let k = 0; k < row.length; k++) {
        cell += this.tablecell(row[k]);
      }
      body += this.tablerow({ text: cell });
    }
    if (body) body = `<tbody>${body}</tbody>`;
    return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
  }
  tablerow({ text }) {
    return `<tr>
${text}</tr>
`;
  }
  tablecell(token) {
    const content = this.parser.parseInline(token.tokens);
    const type = token.header ? "th" : "td";
    const tag2 = token.align ? `<${type} align="${token.align}">` : `<${type}>`;
    return tag2 + content + `</${type}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens }) {
    return `<strong>${this.parser.parseInline(tokens)}</strong>`;
  }
  em({ tokens }) {
    return `<em>${this.parser.parseInline(tokens)}</em>`;
  }
  codespan({ text }) {
    return `<code>${escape2(text, true)}</code>`;
  }
  br(token) {
    return "<br>";
  }
  del({ tokens }) {
    return `<del>${this.parser.parseInline(tokens)}</del>`;
  }
  link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + escape2(title) + '"';
    }
    out += ">" + text + "</a>";
    return out;
  }
  image({ href, title, text, tokens }) {
    if (tokens) {
      text = this.parser.parseInline(tokens, this.parser.textRenderer);
    }
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return escape2(text);
    }
    href = cleanHref;
    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${escape2(title)}"`;
    }
    out += ">";
    return out;
  }
  text(token) {
    return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : "escaped" in token && token.escaped ? token.text : escape2(token.text);
  }
};
var _TextRenderer = class {
  static {
    __name(this, "_TextRenderer");
  }
  // no need for block level renderers
  strong({ text }) {
    return text;
  }
  em({ text }) {
    return text;
  }
  codespan({ text }) {
    return text;
  }
  del({ text }) {
    return text;
  }
  html({ text }) {
    return text;
  }
  text({ text }) {
    return text;
  }
  link({ text }) {
    return "" + text;
  }
  image({ text }) {
    return "" + text;
  }
  br() {
    return "";
  }
};
var _Parser = class __Parser {
  static {
    __name(this, "__Parser");
  }
  options;
  renderer;
  textRenderer;
  constructor(options2) {
    this.options = options2 || _defaults;
    this.options.renderer = this.options.renderer || new _Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.renderer.parser = this;
    this.textRenderer = new _TextRenderer();
  }
  /**
   * Static Parse Method
   */
  static parse(tokens, options2) {
    const parser2 = new __Parser(options2);
    return parser2.parse(tokens);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens, options2) {
    const parser2 = new __Parser(options2);
    return parser2.parseInline(tokens);
  }
  /**
   * Parse Loop
   */
  parse(tokens, top = true) {
    let out = "";
    for (let i = 0; i < tokens.length; i++) {
      const anyToken = tokens[i];
      if (this.options.extensions?.renderers?.[anyToken.type]) {
        const genericToken = anyToken;
        const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
        if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
          out += ret || "";
          continue;
        }
      }
      const token = anyToken;
      switch (token.type) {
        case "space": {
          out += this.renderer.space(token);
          continue;
        }
        case "hr": {
          out += this.renderer.hr(token);
          continue;
        }
        case "heading": {
          out += this.renderer.heading(token);
          continue;
        }
        case "code": {
          out += this.renderer.code(token);
          continue;
        }
        case "table": {
          out += this.renderer.table(token);
          continue;
        }
        case "blockquote": {
          out += this.renderer.blockquote(token);
          continue;
        }
        case "list": {
          out += this.renderer.list(token);
          continue;
        }
        case "html": {
          out += this.renderer.html(token);
          continue;
        }
        case "paragraph": {
          out += this.renderer.paragraph(token);
          continue;
        }
        case "text": {
          let textToken = token;
          let body = this.renderer.text(textToken);
          while (i + 1 < tokens.length && tokens[i + 1].type === "text") {
            textToken = tokens[++i];
            body += "\n" + this.renderer.text(textToken);
          }
          if (top) {
            out += this.renderer.paragraph({
              type: "paragraph",
              raw: body,
              text: body,
              tokens: [{ type: "text", raw: body, text: body, escaped: true }]
            });
          } else {
            out += body;
          }
          continue;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(tokens, renderer = this.renderer) {
    let out = "";
    for (let i = 0; i < tokens.length; i++) {
      const anyToken = tokens[i];
      if (this.options.extensions?.renderers?.[anyToken.type]) {
        const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
        if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(anyToken.type)) {
          out += ret || "";
          continue;
        }
      }
      const token = anyToken;
      switch (token.type) {
        case "escape": {
          out += renderer.text(token);
          break;
        }
        case "html": {
          out += renderer.html(token);
          break;
        }
        case "link": {
          out += renderer.link(token);
          break;
        }
        case "image": {
          out += renderer.image(token);
          break;
        }
        case "strong": {
          out += renderer.strong(token);
          break;
        }
        case "em": {
          out += renderer.em(token);
          break;
        }
        case "codespan": {
          out += renderer.codespan(token);
          break;
        }
        case "br": {
          out += renderer.br(token);
          break;
        }
        case "del": {
          out += renderer.del(token);
          break;
        }
        case "text": {
          out += renderer.text(token);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
};
var _Hooks = class {
  static {
    __name(this, "_Hooks");
  }
  options;
  block;
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  static passThroughHooks = /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ]);
  /**
   * Process markdown before marked
   */
  preprocess(markdown) {
    return markdown;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(html2) {
    return html2;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(tokens) {
    return tokens;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? _Lexer.lex : _Lexer.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? _Parser.parse : _Parser.parseInline;
  }
};
var Marked = class {
  static {
    __name(this, "Marked");
  }
  defaults = _getDefaults();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = _Parser;
  Renderer = _Renderer;
  TextRenderer = _TextRenderer;
  Lexer = _Lexer;
  Tokenizer = _Tokenizer;
  Hooks = _Hooks;
  constructor(...args) {
    this.use(...args);
  }
  /**
   * Run callback for every token
   */
  walkTokens(tokens, callback) {
    let values = [];
    for (const token of tokens) {
      values = values.concat(callback.call(this, token));
      switch (token.type) {
        case "table": {
          const tableToken = token;
          for (const cell of tableToken.header) {
            values = values.concat(this.walkTokens(cell.tokens, callback));
          }
          for (const row of tableToken.rows) {
            for (const cell of row) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
          }
          break;
        }
        case "list": {
          const listToken = token;
          values = values.concat(this.walkTokens(listToken.items, callback));
          break;
        }
        default: {
          const genericToken = token;
          if (this.defaults.extensions?.childTokens?.[genericToken.type]) {
            this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
              const tokens2 = genericToken[childTokens].flat(Infinity);
              values = values.concat(this.walkTokens(tokens2, callback));
            });
          } else if (genericToken.tokens) {
            values = values.concat(this.walkTokens(genericToken.tokens, callback));
          }
        }
      }
    }
    return values;
  }
  use(...args) {
    const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
    args.forEach((pack) => {
      const opts = { ...pack };
      opts.async = this.defaults.async || opts.async || false;
      if (pack.extensions) {
        pack.extensions.forEach((ext) => {
          if (!ext.name) {
            throw new Error("extension name required");
          }
          if ("renderer" in ext) {
            const prevRenderer = extensions.renderers[ext.name];
            if (prevRenderer) {
              extensions.renderers[ext.name] = function(...args2) {
                let ret = ext.renderer.apply(this, args2);
                if (ret === false) {
                  ret = prevRenderer.apply(this, args2);
                }
                return ret;
              };
            } else {
              extensions.renderers[ext.name] = ext.renderer;
            }
          }
          if ("tokenizer" in ext) {
            if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
              throw new Error("extension level must be 'block' or 'inline'");
            }
            const extLevel = extensions[ext.level];
            if (extLevel) {
              extLevel.unshift(ext.tokenizer);
            } else {
              extensions[ext.level] = [ext.tokenizer];
            }
            if (ext.start) {
              if (ext.level === "block") {
                if (extensions.startBlock) {
                  extensions.startBlock.push(ext.start);
                } else {
                  extensions.startBlock = [ext.start];
                }
              } else if (ext.level === "inline") {
                if (extensions.startInline) {
                  extensions.startInline.push(ext.start);
                } else {
                  extensions.startInline = [ext.start];
                }
              }
            }
          }
          if ("childTokens" in ext && ext.childTokens) {
            extensions.childTokens[ext.name] = ext.childTokens;
          }
        });
        opts.extensions = extensions;
      }
      if (pack.renderer) {
        const renderer = this.defaults.renderer || new _Renderer(this.defaults);
        for (const prop in pack.renderer) {
          if (!(prop in renderer)) {
            throw new Error(`renderer '${prop}' does not exist`);
          }
          if (["options", "parser"].includes(prop)) {
            continue;
          }
          const rendererProp = prop;
          const rendererFunc = pack.renderer[rendererProp];
          const prevRenderer = renderer[rendererProp];
          renderer[rendererProp] = (...args2) => {
            let ret = rendererFunc.apply(renderer, args2);
            if (ret === false) {
              ret = prevRenderer.apply(renderer, args2);
            }
            return ret || "";
          };
        }
        opts.renderer = renderer;
      }
      if (pack.tokenizer) {
        const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
        for (const prop in pack.tokenizer) {
          if (!(prop in tokenizer)) {
            throw new Error(`tokenizer '${prop}' does not exist`);
          }
          if (["options", "rules", "lexer"].includes(prop)) {
            continue;
          }
          const tokenizerProp = prop;
          const tokenizerFunc = pack.tokenizer[tokenizerProp];
          const prevTokenizer = tokenizer[tokenizerProp];
          tokenizer[tokenizerProp] = (...args2) => {
            let ret = tokenizerFunc.apply(tokenizer, args2);
            if (ret === false) {
              ret = prevTokenizer.apply(tokenizer, args2);
            }
            return ret;
          };
        }
        opts.tokenizer = tokenizer;
      }
      if (pack.hooks) {
        const hooks = this.defaults.hooks || new _Hooks();
        for (const prop in pack.hooks) {
          if (!(prop in hooks)) {
            throw new Error(`hook '${prop}' does not exist`);
          }
          if (["options", "block"].includes(prop)) {
            continue;
          }
          const hooksProp = prop;
          const hooksFunc = pack.hooks[hooksProp];
          const prevHook = hooks[hooksProp];
          if (_Hooks.passThroughHooks.has(prop)) {
            hooks[hooksProp] = (arg) => {
              if (this.defaults.async) {
                return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                  return prevHook.call(hooks, ret2);
                });
              }
              const ret = hooksFunc.call(hooks, arg);
              return prevHook.call(hooks, ret);
            };
          } else {
            hooks[hooksProp] = (...args2) => {
              let ret = hooksFunc.apply(hooks, args2);
              if (ret === false) {
                ret = prevHook.apply(hooks, args2);
              }
              return ret;
            };
          }
        }
        opts.hooks = hooks;
      }
      if (pack.walkTokens) {
        const walkTokens2 = this.defaults.walkTokens;
        const packWalktokens = pack.walkTokens;
        opts.walkTokens = function(token) {
          let values = [];
          values.push(packWalktokens.call(this, token));
          if (walkTokens2) {
            values = values.concat(walkTokens2.call(this, token));
          }
          return values;
        };
      }
      this.defaults = { ...this.defaults, ...opts };
    });
    return this;
  }
  setOptions(opt) {
    this.defaults = { ...this.defaults, ...opt };
    return this;
  }
  lexer(src, options2) {
    return _Lexer.lex(src, options2 ?? this.defaults);
  }
  parser(tokens, options2) {
    return _Parser.parse(tokens, options2 ?? this.defaults);
  }
  parseMarkdown(blockType) {
    const parse22 = /* @__PURE__ */ __name((src, options2) => {
      const origOpt = { ...options2 };
      const opt = { ...this.defaults, ...origOpt };
      const throwError = this.onError(!!opt.silent, !!opt.async);
      if (this.defaults.async === true && origOpt.async === false) {
        return throwError(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      }
      if (typeof src === "undefined" || src === null) {
        return throwError(new Error("marked(): input parameter is undefined or null"));
      }
      if (typeof src !== "string") {
        return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
      }
      if (opt.hooks) {
        opt.hooks.options = opt;
        opt.hooks.block = blockType;
      }
      const lexer2 = opt.hooks ? opt.hooks.provideLexer() : blockType ? _Lexer.lex : _Lexer.lexInline;
      const parser2 = opt.hooks ? opt.hooks.provideParser() : blockType ? _Parser.parse : _Parser.parseInline;
      if (opt.async) {
        return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
      }
      try {
        if (opt.hooks) {
          src = opt.hooks.preprocess(src);
        }
        let tokens = lexer2(src, opt);
        if (opt.hooks) {
          tokens = opt.hooks.processAllTokens(tokens);
        }
        if (opt.walkTokens) {
          this.walkTokens(tokens, opt.walkTokens);
        }
        let html2 = parser2(tokens, opt);
        if (opt.hooks) {
          html2 = opt.hooks.postprocess(html2);
        }
        return html2;
      } catch (e) {
        return throwError(e);
      }
    }, "parse2");
    return parse22;
  }
  onError(silent, async) {
    return (e) => {
      e.message += "\nPlease report this to https://github.com/markedjs/marked.";
      if (silent) {
        const msg = "<p>An error occurred:</p><pre>" + escape2(e.message + "", true) + "</pre>";
        if (async) {
          return Promise.resolve(msg);
        }
        return msg;
      }
      if (async) {
        return Promise.reject(e);
      }
      throw e;
    };
  }
};
var markedInstance = new Marked();
function marked(src, opt) {
  return markedInstance.parse(src, opt);
}
__name(marked, "marked");
marked.options = marked.setOptions = function(options2) {
  markedInstance.setOptions(options2);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.getDefaults = _getDefaults;
marked.defaults = _defaults;
marked.use = function(...args) {
  markedInstance.use(...args);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.walkTokens = function(tokens, callback) {
  return markedInstance.walkTokens(tokens, callback);
};
marked.parseInline = markedInstance.parseInline;
marked.Parser = _Parser;
marked.parser = _Parser.parse;
marked.Renderer = _Renderer;
marked.TextRenderer = _TextRenderer;
marked.Lexer = _Lexer;
marked.lexer = _Lexer.lex;
marked.Tokenizer = _Tokenizer;
marked.Hooks = _Hooks;
marked.parse = marked;
var options = marked.options;
var setOptions = marked.setOptions;
var use = marked.use;
var walkTokens = marked.walkTokens;
var parseInline = marked.parseInline;
var parser = _Parser.parse;
var lexer = _Lexer.lex;

// node_modules/@liveblocks/node/dist/index.js
var base643 = __toESM(require_base64(), 1);
var sha256 = __toESM(require_sha256(), 1);
var PKG_NAME2 = "@liveblocks/node";
var PKG_VERSION2 = "3.19.3";
var PKG_FORMAT2 = "esm";
async function asyncConsume(iterable) {
  const result = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}
__name(asyncConsume, "asyncConsume");
async function runConcurrently(iterable, fn, concurrency) {
  const queue = /* @__PURE__ */ new Set();
  for await (const item of iterable) {
    if (queue.size >= concurrency) {
      await Promise.race(queue);
    }
    const promise2 = (async () => {
      try {
        await fn(item);
      } finally {
        queue.delete(promise2);
      }
    })();
    queue.add(promise2);
  }
  if (queue.size > 0) {
    await Promise.all(queue);
  }
}
__name(runConcurrently, "runConcurrently");
var LineStream = class extends TransformStream {
  static {
    __name(this, "LineStream");
  }
  constructor() {
    let buffer = "";
    super({
      transform(chunk, controller) {
        buffer += chunk;
        if (buffer.includes("\n")) {
          const lines = buffer.split("\n");
          for (let i = 0; i < lines.length - 1; i++) {
            if (lines[i].length > 0) {
              controller.enqueue(lines[i]);
            }
          }
          buffer = lines[lines.length - 1];
        }
      },
      flush(controller) {
        if (buffer.length > 0) {
          controller.enqueue(buffer);
        }
      }
    });
  }
};
var NdJsonStream = class extends TransformStream {
  static {
    __name(this, "NdJsonStream");
  }
  constructor() {
    super({
      transform(line, controller) {
        const json2 = JSON.parse(line);
        controller.enqueue(json2);
      }
    });
  }
};
function xwarn(resp, method, path) {
  const message = resp.headers.get("X-LB-Warn");
  if (message) {
    const msg = `  ⚠ [Liveblocks] ${message} (${method} ${path})`;
    if (resp.ok) {
      console.warn(msg);
    } else {
      console.error(msg);
    }
  }
}
__name(xwarn, "xwarn");
var DEFAULT_BASE_URL = "https://api.liveblocks.io";
var VALID_KEY_CHARS_REGEX = /^[\w-]+$/;
function getBaseUrl(baseUrl) {
  if (typeof baseUrl === "string" && baseUrl.startsWith("http")) {
    return baseUrl;
  } else {
    return DEFAULT_BASE_URL;
  }
}
__name(getBaseUrl, "getBaseUrl");
async function fetchPolyfill() {
  return typeof globalThis.fetch !== "undefined" ? globalThis.fetch : (await import("./lib-V5MALD3Y.mjs")).default;
}
__name(fetchPolyfill, "fetchPolyfill");
function isString(value) {
  return typeof value === "string";
}
__name(isString, "isString");
function startsWith(value, prefix) {
  return isString(value) && value.startsWith(prefix);
}
__name(startsWith, "startsWith");
function isNonEmpty(value) {
  return isString(value) && value.length > 0;
}
__name(isNonEmpty, "isNonEmpty");
function assertNonEmpty(value, field) {
  if (!isNonEmpty(value)) {
    throw new Error(
      `Invalid value for field '${field}'. Please provide a non-empty string. For more information: https://liveblocks.io/docs/api-reference/liveblocks-node#authorize`
    );
  }
}
__name(assertNonEmpty, "assertNonEmpty");
function assertSecretKey(value, field) {
  if (!startsWith(value, "sk_")) {
    throw new Error(
      `Invalid value for field '${field}'. Secret keys must start with 'sk_'. Please provide the secret key from your Liveblocks dashboard at https://liveblocks.io/dashboard/apikeys.`
    );
  }
  if (!VALID_KEY_CHARS_REGEX.test(value)) {
    throw new Error(
      `Invalid chars found in field '${field}'. Please check that you correctly copied the secret key from your Liveblocks dashboard at https://liveblocks.io/dashboard/apikeys.`
    );
  }
}
__name(assertSecretKey, "assertSecretKey");
function normalizeStatusCode(statusCode) {
  if (statusCode >= 200 && statusCode < 300) {
    return 200;
  } else if (statusCode >= 500) {
    return 503;
  } else {
    return statusCode;
  }
}
__name(normalizeStatusCode, "normalizeStatusCode");
var ALL_PERMISSIONS = Object.freeze([
  "room:write",
  "room:read",
  "room:presence:write",
  "comments:write",
  "comments:read",
  "feeds:write"
]);
function isPermission(value) {
  return ALL_PERMISSIONS.includes(value);
}
__name(isPermission, "isPermission");
var MAX_PERMS_PER_SET = 10;
var READ_ACCESS = Object.freeze([
  "room:read",
  "room:presence:write",
  // TODO: Remove once backend no longer requires this
  "comments:read"
  // TODO: Remove — implied by room:read
]);
var FULL_ACCESS = Object.freeze(["room:write"]);
var roomPatternRegex = /^([*]|[^*]{1,128}[*]?)$/;
var Session = class {
  static {
    __name(this, "Session");
  }
  FULL_ACCESS = FULL_ACCESS;
  READ_ACCESS = READ_ACCESS;
  #postFn;
  #userId;
  #userInfo;
  #organizationId;
  /** Only used as a hint to produce better error messages. */
  #localDev;
  #sealed = false;
  #permissions = /* @__PURE__ */ new Map();
  /** @internal */
  constructor(postFn, userId, userInfo, organizationId, localDev) {
    assertNonEmpty(userId, "userId");
    this.#postFn = postFn;
    this.#userId = userId;
    this.#userInfo = userInfo;
    this.#organizationId = organizationId;
    this.#localDev = localDev ?? false;
  }
  #getOrCreate(roomId) {
    if (this.#sealed) {
      throw new Error("You can no longer change these permissions.");
    }
    let perms = this.#permissions.get(roomId);
    if (perms) {
      return perms;
    } else {
      if (this.#permissions.size >= MAX_PERMS_PER_SET) {
        throw new Error(
          "You cannot add permissions for more than 10 rooms in a single token"
        );
      }
      perms = /* @__PURE__ */ new Set();
      this.#permissions.set(roomId, perms);
      return perms;
    }
  }
  allow(roomIdOrPattern, newPerms) {
    if (typeof roomIdOrPattern !== "string") {
      throw new Error("Room name or pattern must be a string");
    }
    if (!roomPatternRegex.test(roomIdOrPattern)) {
      throw new Error("Invalid room name or pattern");
    }
    if (newPerms.length === 0) {
      throw new Error("Permission list cannot be empty");
    }
    const existingPerms = this.#getOrCreate(roomIdOrPattern);
    for (const perm of newPerms) {
      if (!isPermission(perm)) {
        throw new Error(`Not a valid permission: ${perm}`);
      }
      existingPerms.add(perm);
    }
    return this;
  }
  /** @internal - For unit tests only */
  hasPermissions() {
    return this.#permissions.size > 0;
  }
  /** @internal - For unit tests only */
  seal() {
    if (this.#sealed) {
      throw new Error(
        "You cannot reuse Session instances. Please create a new session every time."
      );
    }
    this.#sealed = true;
  }
  /** @internal - For unit tests only */
  serializePermissions() {
    return Object.fromEntries(
      Array.from(this.#permissions.entries()).map(([pat, perms]) => [
        pat,
        Array.from(perms)
      ])
    );
  }
  /**
   * Call this to authorize the session to access Liveblocks. Note that this
   * will return a Liveblocks "access token". Anyone that obtains such access
   * token will have access to the allowed resources.
   */
  async authorize() {
    this.seal();
    if (!this.hasPermissions()) {
      console.warn(
        "Access tokens without any permission will not be supported soon, you should use wildcards when the client requests a token for resources outside a room. See https://liveblocks.io/docs/errors/liveblocks-client/access-tokens-not-enough-permissions"
      );
    }
    try {
      const body = {
        // Required
        userId: this.#userId,
        permissions: this.serializePermissions(),
        // Optional metadata
        userInfo: this.#userInfo
      };
      if (this.#organizationId !== void 0) {
        body.organizationId = this.#organizationId;
      }
      const resp = await this.#postFn(url2`/v2/authorize-user`, body);
      return {
        status: normalizeStatusCode(resp.status),
        body: await resp.text()
      };
    } catch (er) {
      return {
        status: 503,
        body: this.#localDev ? "Could not connect to your Liveblocks dev server. Is it running?" : 'Call to /v2/authorize-user failed. See "error" for more information.',
        error: er
      };
    }
  }
};
function inflateRoomData(room) {
  const createdAt = new Date(room.createdAt);
  const lastConnectionAt = room.lastConnectionAt ? new Date(room.lastConnectionAt) : void 0;
  return {
    ...room,
    createdAt,
    lastConnectionAt
  };
}
__name(inflateRoomData, "inflateRoomData");
function inflateAiCopilot(copilot) {
  return {
    ...copilot,
    createdAt: new Date(copilot.createdAt),
    updatedAt: new Date(copilot.updatedAt),
    lastUsedAt: copilot.lastUsedAt ? new Date(copilot.lastUsedAt) : void 0
  };
}
__name(inflateAiCopilot, "inflateAiCopilot");
function inflateKnowledgeSource(source) {
  return {
    ...source,
    createdAt: new Date(source.createdAt),
    updatedAt: new Date(source.updatedAt),
    lastIndexedAt: new Date(source.lastIndexedAt)
  };
}
__name(inflateKnowledgeSource, "inflateKnowledgeSource");
function inflateWebKnowledgeSourceLink(link2) {
  return {
    ...link2,
    createdAt: new Date(link2.createdAt),
    lastIndexedAt: new Date(link2.lastIndexedAt)
  };
}
__name(inflateWebKnowledgeSourceLink, "inflateWebKnowledgeSourceLink");
var Liveblocks = class {
  static {
    __name(this, "Liveblocks");
  }
  #secret;
  #baseUrl;
  /** Only used as a hint to produce better error messages. */
  #localDev;
  /**
   * Interact with the Liveblocks API from your Node.js backend.
   */
  constructor(options2) {
    const options_ = options2;
    const secret = options_.secret;
    assertSecretKey(secret, "secret");
    this.#secret = secret;
    this.#baseUrl = new URL(getBaseUrl(options2.baseUrl));
    this.#localDev = !!options2.baseUrl && /^https?:\/\/localhost[:/]/.test(options2.baseUrl);
  }
  async #post(path, json2, options2) {
    const url3 = urljoin(this.#baseUrl, path);
    const headers = {
      Authorization: `Bearer ${this.#secret}`,
      "Content-Type": "application/json"
    };
    const fetch2 = await fetchPolyfill();
    const res = await fetch2(url3, {
      method: "POST",
      headers,
      body: JSON.stringify(json2),
      signal: options2?.signal
    });
    xwarn(res, "POST", path);
    return res;
  }
  async #patch(path, json2, options2) {
    const url3 = urljoin(this.#baseUrl, path);
    const headers = {
      Authorization: `Bearer ${this.#secret}`,
      "Content-Type": "application/json"
    };
    const fetch2 = await fetchPolyfill();
    const res = await fetch2(url3, {
      method: "PATCH",
      headers,
      body: JSON.stringify(json2),
      signal: options2?.signal
    });
    xwarn(res, "PATCH", path);
    return res;
  }
  async #putBinary(path, body, params, options2) {
    const url3 = urljoin(this.#baseUrl, path, params);
    const headers = {
      Authorization: `Bearer ${this.#secret}`,
      "Content-Type": "application/octet-stream"
    };
    const fetch2 = await fetchPolyfill();
    const res = await fetch2(url3, {
      method: "PUT",
      headers,
      body,
      signal: options2?.signal
    });
    xwarn(res, "PUT", path);
    return res;
  }
  async #delete(path, params, options2) {
    const url3 = urljoin(this.#baseUrl, path, params);
    const headers = {
      Authorization: `Bearer ${this.#secret}`
    };
    const fetch2 = await fetchPolyfill();
    const res = await fetch2(url3, {
      method: "DELETE",
      headers,
      signal: options2?.signal
    });
    xwarn(res, "DELETE", path);
    return res;
  }
  async #get(path, params, options2) {
    const url3 = urljoin(this.#baseUrl, path, params);
    const headers = {
      Authorization: `Bearer ${this.#secret}`
    };
    const fetch2 = await fetchPolyfill();
    const res = await fetch2(url3, {
      method: "GET",
      headers,
      signal: options2?.signal
    });
    xwarn(res, "GET", path);
    return res;
  }
  /* -------------------------------------------------------------------------------------------------
   * Authentication
   * -----------------------------------------------------------------------------------------------*/
  /**
   * Prepares a new session to authorize a user to access Liveblocks.
   *
   * IMPORTANT:
   * Always make sure that you trust the user making the request to your
   * backend before calling .prepareSession()!
   *
   * @param userId Tell Liveblocks the user ID of the user to authorize. Must
   * uniquely identify the user account in your system. The uniqueness of this
   * value will determine how many MAUs will be counted/billed.
   *
   * @param options.organizationId (optional) The organization ID to authorize the user for.
   *
   * @param options.userInfo Custom metadata to attach to this user. Data you
   * add here will be visible to all other clients in the room, through the
   * `other.info` property.
   *
   */
  prepareSession(userId, ...rest) {
    const options2 = rest[0];
    return new Session(
      this.#post.bind(this),
      userId,
      options2?.userInfo,
      options2?.organizationId ?? options2?.tenantId,
      this.#localDev
    );
  }
  /**
   * Call this to authenticate the user as an actor you want to allow to use
   * Liveblocks.
   *
   * You should use this method only if you want to manage your permissions
   * through the Liveblocks Permissions API. This method is more complicated to
   * set up, but allows for finer-grained specification of permissions.
   *
   * Calling `.identifyUser()` only lets you securely identify a user (and what
   * groups they belong to). What permissions this user will end up having is
   * determined by whatever permissions you assign the user/group in your
   * Liveblocks account, through the Permissions API:
   * https://liveblocks.io/docs/rooms/permissions
   *
   * IMPORTANT:
   * Always verify that you trust the user making the request before calling
   * .identifyUser()!
   *
   * @param identity Tell Liveblocks the user ID of the user to authenticate.
   * Must uniquely identify the user account in your system. The uniqueness of
   * this value will determine how many MAUs will be counted/billed.
   *
   * If you also want to assign which groups this user belongs to, use the
   * object form and specify the `groupIds` property. Those `groupIds` should
   * match the groupIds you assigned permissions to via the Liveblocks
   * Permissions API, see
   * https://liveblocks.io/docs/rooms/permissions#permissions-levels-groups-accesses-example
   *
   * @param options.userInfo Custom metadata to attach to this user. Data you
   * add here will be visible to all other clients in the room, through the
   * `other.info` property.
   */
  // These fields define the security identity of the user. Whatever you pass in here will define which
  async identifyUser(identity, ...rest) {
    const options2 = rest[0];
    const path = url2`/v2/identify-user`;
    const { userId, groupIds, tenantId, organizationId } = typeof identity === "string" ? {
      userId: identity,
      groupIds: void 0,
      tenantId: void 0,
      organizationId: void 0
    } : identity;
    assertNonEmpty(userId, "userId");
    const body = {
      userId,
      groupIds,
      userInfo: options2?.userInfo
    };
    if (organizationId !== void 0) {
      body.organizationId = organizationId;
    } else if (tenantId !== void 0) {
      body.organizationId = tenantId;
    }
    try {
      const resp = await this.#post(path, body);
      return {
        status: normalizeStatusCode(resp.status),
        body: await resp.text()
      };
    } catch (er) {
      return {
        status: 503,
        body: this.#localDev ? "Could not connect to your Liveblocks dev server. Is it running?" : `Call to ${urljoin(
          this.#baseUrl,
          path
        )} failed. See "error" for more information.`,
        error: er
      };
    }
  }
  /* -------------------------------------------------------------------------------------------------
   * Room
   * -----------------------------------------------------------------------------------------------*/
  /**
   * Returns a list of your rooms. The rooms are returned sorted by creation date, from newest to oldest. You can filter rooms by metadata, users accesses and groups accesses.
   * @param params.limit (optional) A limit on the number of rooms to be returned. The limit can range between 1 and 100, and defaults to 20.
   * @param params.startingAfter (optional) A cursor used for pagination. You get the value from the response of the previous page.
   * @param params.userId (optional) A filter on users accesses.
   * @param params.metadata (optional) A filter on metadata. Multiple metadata keys can be used to filter rooms.
   * @param params.groupIds (optional) A filter on groups accesses. Multiple groups can be used.
   * @param params.organizationId (optional) A filter on organization ID.
   * @param params.query (optional) A query to filter rooms by. It is based on our query language. You can filter by metadata and room ID.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A list of rooms.
   */
  async getRooms(params = {}, options2) {
    const path = url2`/v2/rooms`;
    let query;
    if (typeof params.query === "string") {
      query = params.query;
    } else if (typeof params.query === "object") {
      query = objectToQuery(params.query);
    }
    const queryParams = {
      limit: params.limit,
      startingAfter: params.startingAfter,
      userId: params.userId,
      groupIds: params.groupIds ? params.groupIds.join(",") : void 0,
      query
    };
    if (params.organizationId !== void 0) {
      queryParams.organizationId = params.organizationId;
    } else if (params.tenantId !== void 0) {
      queryParams.organizationId = params.tenantId;
    }
    const res = await this.#get(path, queryParams, options2);
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const page = await res.json();
    const rooms = page.data.map(inflateRoomData);
    return {
      ...page,
      data: rooms
    };
  }
  /**
   * Iterates over all rooms that match the given criteria.
   *
   * The difference with .getRooms() is that pagination will happen
   * automatically under the hood, using the given `pageSize`.
   *
   * @param criteria.userId (optional) A filter on users accesses.
   * @param criteria.groupIds (optional) A filter on groups accesses. Multiple groups can be used.
   * @param criteria.query.roomId (optional) A filter by room ID.
   * @param criteria.query.metadata (optional) A filter by metadata.
   *
   * @param options.pageSize (optional) The page size to use for each request.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async *iterRooms(criteria, options2) {
    const { signal } = options2 ?? {};
    const pageSize = checkBounds("pageSize", options2?.pageSize ?? 40, 20);
    let cursor = void 0;
    while (true) {
      const { nextCursor, data } = await this.getRooms(
        { ...criteria, startingAfter: cursor, limit: pageSize },
        { signal }
      );
      for (const item of data) {
        yield item;
      }
      if (!nextCursor) {
        break;
      }
      cursor = nextCursor;
    }
  }
  /**
   * Creates a new room with the given id.
   * @param roomId The id of the room to create.
   * @param params.defaultAccesses The default accesses for the room.
   * @param params.groupsAccesses (optional) The group accesses for the room. Can contain a maximum of 100 entries. Key length has a limit of 40 characters.
   * @param params.usersAccesses (optional) The user accesses for the room. Can contain a maximum of 100 entries. Key length has a limit of 40 characters.
   * @param params.metadata (optional) The metadata for the room. Supports upto a maximum of 50 entries. Key length has a limit of 40 characters. Value length has a limit of 256 characters.
   * @param params.organizationId (optional) The organization ID to create the room for.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The created room.
   */
  async createRoom(roomId, params, options2) {
    const {
      defaultAccesses,
      groupsAccesses,
      usersAccesses,
      metadata,
      tenantId,
      organizationId
    } = params;
    const body = {
      id: roomId,
      defaultAccesses,
      groupsAccesses,
      usersAccesses,
      metadata
    };
    if (organizationId !== void 0) {
      body.organizationId = organizationId;
    } else if (tenantId !== void 0) {
      body.organizationId = tenantId;
    }
    const res = await this.#post(
      options2?.idempotent ? url2`/v2/rooms?idempotent` : url2`/v2/rooms`,
      body,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return inflateRoomData(data);
  }
  /**
   * Returns a room with the given id, or creates one with the given creation
   * options if it doesn't exist yet.
   *
   * @param roomId The id of the room.
   * @param params.defaultAccesses The default accesses for the room if the room will be created.
   * @param params.groupsAccesses (optional) The group accesses for the room if the room will be created. Can contain a maximum of 100 entries. Key length has a limit of 40 characters.
   * @param params.usersAccesses (optional) The user accesses for the room if the room will be created. Can contain a maximum of 100 entries. Key length has a limit of 40 characters.
   * @param params.metadata (optional) The metadata for the room if the room will be created. Supports upto a maximum of 50 entries. Key length has a limit of 40 characters. Value length has a limit of 256 characters.
   * @param params.organizationId (optional) The organization ID to create the room for.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The room.
   */
  async getOrCreateRoom(roomId, params, options2) {
    return await this.createRoom(roomId, params, {
      ...options2,
      idempotent: true
    });
  }
  /**
   * Updates or creates a new room with the given properties.
   *
   * @param roomId The id of the room to update or create.
   * @param update The fields to update. These values will be updated when the room exists, or set when the room does not exist and gets created. Must specify at least one key.
   * @param create (optional) The fields to only use when the room does not exist and will be created. When the room already exists, these values are ignored.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The room.
   */
  async upsertRoom(roomId, params, options2) {
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/upsert`,
      params,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return inflateRoomData(data);
  }
  /**
   * Returns a room with the given id.
   * @param roomId The id of the room to return.
   * @returns The room with the given id.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getRoom(roomId, options2) {
    const res = await this.#get(url2`/v2/rooms/${roomId}`, void 0, options2);
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return inflateRoomData(data);
  }
  /**
   * Updates specific properties of a room. It’s not necessary to provide the entire room’s information.
   * Setting a property to `null` means to delete this property.
   * @param roomId The id of the room to update.
   * @param params.defaultAccesses (optional) The default accesses for the room.
   * @param params.groupsAccesses (optional) The group accesses for the room. Can contain a maximum of 100 entries. Key length has a limit of 40 characters.
   * @param params.usersAccesses (optional) The user accesses for the room. Can contain a maximum of 100 entries. Key length has a limit of 40 characters.
   * @param params.metadata (optional) The metadata for the room. Supports upto a maximum of 50 entries. Key length has a limit of 40 characters. Value length has a limit of 256 characters.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The updated room.
   */
  async updateRoom(roomId, params, options2) {
    const { defaultAccesses, groupsAccesses, usersAccesses, metadata } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}`,
      {
        defaultAccesses,
        groupsAccesses,
        usersAccesses,
        metadata
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return inflateRoomData(data);
  }
  /**
   * Deletes a room with the given id. A deleted room is no longer accessible from the API or the dashboard and it cannot be restored.
   * @param roomId The id of the room to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteRoom(roomId, options2) {
    const res = await this.#delete(
      url2`/v2/rooms/${roomId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Prepares a room for connectivity, making the eventual connection faster. Use this when you know you'll be loading a room but are not yet connected to it.
   * @param roomId The id of the room to prewarm.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async prewarmRoom(roomId, options2) {
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/prewarm`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Returns a list of users currently present in the requested room. For better performance, we recommand to call this endpoint every 10 seconds maximum. Duplicates can happen if a user is in the requested room with multiple browser tabs opened.
   * @param roomId The id of the room to get the users from.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A list of users currently present in the requested room.
   */
  async getActiveUsers(roomId, options2) {
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/active_users`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Boadcasts an event to a room without having to connect to it via the client from @liveblocks/client. The connectionId passed to event listeners is -1 when using this API.
   * @param roomId The id of the room to broadcast the event to.
   * @param message The message to broadcast. It can be any JSON serializable value.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async broadcastEvent(roomId, message, options2) {
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/broadcast_event`,
      message,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Sets ephemeral presence for a user in a room without requiring a WebSocket connection.
   * The presence data will automatically expire after the specified TTL.
   * This is useful for scenarios like showing an AI agent's presence in a room.
   *
   * @param roomId The id of the room to set presence in.
   * @param params.userId The ID of the user to set presence for.
   * @param params.data The presence data as a JSON object.
   * @param params.userInfo (optional) Metadata about the user or agent
   * @param params.ttl (optional) Time-to-live in seconds. If not specified, the default TTL is 60 seconds. (minimum: 2, maximum: 3599).
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async setPresence(roomId, params, options2) {
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/presence`,
      {
        userId: params.userId,
        data: params.data,
        userInfo: params.userInfo,
        ttl: params.ttl
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  async getStorageDocument(roomId, format = "plain-lson", options2) {
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/storage`,
      { format },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  async #requestStorageMutation(roomId, options2) {
    const resp = await this.#post(
      url2`/v2/rooms/${roomId}/request-storage-mutation`,
      {},
      options2
    );
    if (!resp.ok) {
      throw await LiveblocksError.from(resp);
    }
    if (resp.headers.get("content-type") !== "application/x-ndjson") {
      throw new Error("Unexpected response content type");
    }
    if (resp.body === null) {
      throw new Error("Unexpected null body in response");
    }
    const stream = resp.body.pipeThrough(new TextDecoderStream()).pipeThrough(new LineStream()).pipeThrough(new NdJsonStream());
    const iter = stream[Symbol.asyncIterator]();
    const first = (await iter.next()).value;
    if (!isPlainObject2(first) || typeof first.actor !== "number") {
      throw new Error("Failed to obtain a unique session");
    }
    const nodes = await asyncConsume(iter);
    return { actor: first.actor, nodes };
  }
  /**
   * Initializes a room’s Storage. The room must already exist and have an empty Storage.
   * Calling this endpoint will disconnect all users from the room if there are any.
   *
   * @param roomId The id of the room to initialize the storage from.
   * @param document The document to initialize the storage with.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The initialized storage document. It is of the same format as the one passed in.
   */
  async initializeStorageDocument(roomId, document2, options2) {
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/storage`,
      document2,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Deletes all of the room’s Storage data and disconnect all users from the room if there are any. Note that this does not delete the Yjs document in the room if one exists.
   * @param roomId The id of the room to delete the storage from.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteStorageDocument(roomId, options2) {
    const res = await this.#delete(
      url2`/v2/rooms/${roomId}/storage`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /* -------------------------------------------------------------------------------------------------
   * Yjs
   * -----------------------------------------------------------------------------------------------*/
  /**
   * Returns a JSON representation of the room’s Yjs document.
   * @param roomId The id of the room to get the Yjs document from.
   * @param params.format (optional) If true, YText will return formatting.
   * @param params.key (optional) If provided, returns only a single key’s value, e.g. doc.get(key).toJSON().
   * @param params.type (optional) Used with key to override the inferred type, i.e. "ymap" will return doc.get(key, Y.Map).
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A JSON representation of the room’s Yjs document.
   */
  async getYjsDocument(roomId, params = {}, options2) {
    const { format, key, type } = params;
    const path = url2`v2/rooms/${roomId}/ydoc`;
    const res = await this.#get(
      path,
      { formatting: format ? "true" : void 0, key, type },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Send a Yjs binary update to the room’s Yjs document. You can use this endpoint to initialize Yjs data for the room or to update the room’s Yjs document.
   * @param roomId The id of the room to send the Yjs binary update to.
   * @param update The Yjs update to send. Typically the result of calling `Yjs.encodeStateAsUpdate(doc)`. Read the [Yjs documentation](https://docs.yjs.dev/api/document-updates) to learn how to create a binary update.
   * @param params.guid (optional) If provided, the binary update will be applied to the Yjs subdocument with the given guid. If not provided, the binary update will be applied to the root Yjs document.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async sendYjsBinaryUpdate(roomId, update, params = {}, options2) {
    const res = await this.#putBinary(
      url2`/v2/rooms/${roomId}/ydoc`,
      update,
      { guid: params.guid },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Returns the room’s Yjs document encoded as a single binary update. This can be used by Y.applyUpdate(responseBody) to get a copy of the document in your backend.
   * See [Yjs documentation](https://docs.yjs.dev/api/document-updates) for more information on working with updates.
   * @param roomId The id of the room to get the Yjs document from.
   * @param params.guid (optional) If provided, returns the binary update of the Yjs subdocument with the given guid. If not provided, returns the binary update of the root Yjs document.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The room’s Yjs document encoded as a single binary update.
   */
  async getYjsDocumentAsBinaryUpdate(roomId, params = {}, options2) {
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/ydoc-binary`,
      { guid: params.guid },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return res.arrayBuffer();
  }
  /* -------------------------------------------------------------------------------------------------
   * Comments
   * -----------------------------------------------------------------------------------------------*/
  /**
   * Gets all the threads in a room.
   *
   * @param params.roomId The room ID to get the threads from.
   * @param params.query The query to filter threads by. It is based on our query language and can filter by metadata.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A list of threads.
   */
  async getThreads(params, options2) {
    const { roomId } = params;
    let query;
    if (typeof params.query === "string") {
      query = params.query;
    } else if (typeof params.query === "object") {
      query = objectToQuery(params.query);
    }
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/threads`,
      { query },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const { data } = await res.json();
    return {
      data: data.map((thread) => convertToThreadData(thread))
    };
  }
  /**
   * Gets a thread.
   *
   * @param params.roomId The room ID to get the thread from.
   * @param params.threadId The thread ID.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A thread.
   */
  async getThread(params, options2) {
    const { roomId, threadId } = params;
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/threads/${threadId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return convertToThreadData(await res.json());
  }
  /**
   * @deprecated Prefer using `getMentionsFromCommentBody` to extract mentions
   * from comments and threads, or `Liveblocks.getThreadSubscriptions` to get
   * the list of users who are subscribed to a thread.
   *
   * Gets a thread's participants.
   *
   * Participants are users who have commented on the thread
   * or users that have been mentioned in a comment.
   *
   * @param params.roomId The room ID to get the thread participants from.
   * @param params.threadId The thread ID to get the participants from.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns An object containing an array of participant IDs.
   */
  async getThreadParticipants(params, options2) {
    const { roomId, threadId } = params;
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/threads/${threadId}/participants`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Gets a thread's subscriptions.
   *
   * @param params.roomId The room ID to get the thread subscriptions from.
   * @param params.threadId The thread ID to get the subscriptions from.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns An array of subscriptions.
   */
  async getThreadSubscriptions(params, options2) {
    const { roomId, threadId } = params;
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/threads/${threadId}/subscriptions`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const { data } = await res.json();
    return {
      data: data.map(convertToUserSubscriptionData)
    };
  }
  /**
   * Gets a thread's comment.
   *
   * @param params.roomId The room ID to get the comment from.
   * @param params.threadId The thread ID to get the comment from.
   * @param params.commentId The comment ID.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A comment.
   */
  async getComment(params, options2) {
    const { roomId, threadId, commentId } = params;
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/threads/${threadId}/comments/${commentId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return convertToCommentData(await res.json());
  }
  /**
   * Creates a comment.
   *
   * @param params.roomId The room ID to create the comment in.
   * @param params.threadId The thread ID to create the comment in.
   * @param params.data.userId The user ID of the user who is set to create the comment.
   * @param params.data.createdAt (optional) The date the comment is set to be created.
   * @param params.data.body The body of the comment.
   * @param params.data.metadata (optional) The metadata for the comment.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The created comment.
   */
  async createComment(params, options2) {
    const { roomId, threadId, data } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/comments`,
      {
        ...data,
        createdAt: data.createdAt?.toISOString()
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return convertToCommentData(await res.json());
  }
  /**
   * Edits a comment.
   * @param params.roomId The room ID to edit the comment in.
   * @param params.threadId The thread ID to edit the comment in.
   * @param params.commentId The comment ID to edit.
   * @param params.data.body The body of the comment.
   * @param params.data.metadata (optional) The metadata for the comment. Value must be a string, boolean or number. Use null to delete a key.
   * @param params.data.editedAt (optional) The date the comment was edited.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The edited comment.
   */
  async editComment(params, options2) {
    const { roomId, threadId, commentId, data } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/comments/${commentId}`,
      {
        body: data.body,
        editedAt: data.editedAt?.toISOString(),
        metadata: data.metadata
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return convertToCommentData(await res.json());
  }
  /**
   * Deletes a comment. Deletes a comment. If there are no remaining comments in the thread, the thread is also deleted.
   * @param params.roomId The room ID to delete the comment in.
   * @param params.threadId The thread ID to delete the comment in.
   * @param params.commentId The comment ID to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteComment(params, options2) {
    const { roomId, threadId, commentId } = params;
    const res = await this.#delete(
      url2`/v2/rooms/${roomId}/threads/${threadId}/comments/${commentId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Gets an attachment's metadata and a presigned download URL.
   *
   * @param params.roomId The room ID the attachment belongs to.
   * @param params.attachmentId The attachment ID (starts with "at_").
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The attachment metadata including a presigned download URL.
   */
  async getAttachment(params, options2) {
    const { roomId, attachmentId } = params;
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/attachments/${attachmentId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Creates a new thread. The thread will be created with the specified comment as its first comment.
   * If the thread already exists, a `LiveblocksError` will be thrown with status code 409.
   * @param params.roomId The room ID to create the thread in.
   * @param params.thread.metadata (optional) The metadata for the thread. Supports upto a maximum of 10 entries. Value must be a string, boolean or number
   * @param params.thread.comment.userId The user ID of the user who created the comment.
   * @param params.thread.comment.createdAt (optional) The date the comment was created.
   * @param params.thread.comment.body The body of the comment.
   * @param params.thread.comment.metadata (optional) The metadata for the comment.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The created thread. The thread will be created with the specified comment as its first comment.
   */
  async createThread(params, options2) {
    const { roomId, data } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads`,
      {
        ...data,
        comment: {
          ...data.comment,
          createdAt: data.comment.createdAt?.toISOString()
        }
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return convertToThreadData(await res.json());
  }
  /**
   * Deletes a thread and all of its comments.
   * @param params.roomId The room ID to delete the thread in.
   * @param params.threadId The thread ID to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteThread(params, options2) {
    const { roomId, threadId } = params;
    const res = await this.#delete(
      url2`/v2/rooms/${roomId}/threads/${threadId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Mark a thread as resolved.
   * @param params.roomId The room ID of the thread.
   * @param params.threadId The thread ID to mark as resolved.
   * @param params.data.userId The user ID of the user who marked the thread as resolved.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The thread marked as resolved.
   */
  async markThreadAsResolved(params, options2) {
    const { roomId, threadId } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/mark-as-resolved`,
      { userId: params.data.userId },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return convertToThreadData(await res.json());
  }
  /**
   * Mark a thread as unresolved.
   * @param params.roomId The room ID of the thread.
   * @param params.threadId The thread ID to mark as unresolved.
   * @param params.data.userId The user ID of the user who marked the thread as unresolved.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The thread marked as unresolved.
   */
  async markThreadAsUnresolved(params, options2) {
    const { roomId, threadId } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/mark-as-unresolved`,
      { userId: params.data.userId },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return convertToThreadData(await res.json());
  }
  /**
   * Subscribes a user to a thread.
   * @param params.roomId The room ID of the thread.
   * @param params.threadId The thread ID to subscribe to.
   * @param params.data.userId The user ID of the user to subscribe to the thread.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The thread subscription.
   */
  async subscribeToThread(params, options2) {
    const { roomId, threadId } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/subscribe`,
      { userId: params.data.userId },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return convertToSubscriptionData(
      await res.json()
    );
  }
  /**
   * Unsubscribes a user from a thread.
   * @param params.roomId The room ID of the thread.
   * @param params.threadId The thread ID to unsubscribe from.
   * @param params.data.userId The user ID of the user to unsubscribe from the thread.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async unsubscribeFromThread(params, options2) {
    const { roomId, threadId } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/unsubscribe`,
      { userId: params.data.userId },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Updates the metadata of the specified thread in a room.
   * @param params.roomId The room ID to update the thread in.
   * @param params.threadId The thread ID to update.
   * @param params.data.metadata The metadata for the thread. Value must be a string, boolean or number
   * @param params.data.userId The user ID of the user who updated the thread.
   * @param params.data.updatedAt (optional) The date the thread is set to be updated.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The updated thread metadata.
   */
  async editThreadMetadata(params, options2) {
    const { roomId, threadId, data } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/metadata`,
      {
        ...data,
        updatedAt: data.updatedAt?.toISOString()
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Updates the metadata of the specified comment in a room.
   * @param params.roomId The room ID to update the comment in.
   * @param params.threadId The thread ID to update the comment in.
   * @param params.commentId The comment ID to update.
   * @param params.data.metadata The metadata for the comment. Value must be a string, boolean or number. Use null to delete a key.
   * @param params.data.userId The user ID of the user who updated the comment.
   * @param params.data.updatedAt (optional) The date the comment metadata is set to be updated.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The updated comment metadata.
   */
  async editCommentMetadata(params, options2) {
    const { roomId, threadId, commentId, data } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/comments/${commentId}/metadata`,
      {
        ...data,
        updatedAt: data.updatedAt?.toISOString()
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Adds a new comment reaction to a comment.
   * @param params.roomId The room ID to add the comment reaction in.
   * @param params.threadId The thread ID to add the comment reaction in.
   * @param params.commentId The comment ID to add the reaction in.
   * @param params.data.emoji The (emoji) reaction to add.
   * @param params.data.userId The user ID of the user associated with the reaction.
   * @param params.data.createdAt (optional) The date the reaction is set to be created.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The created comment reaction.
   */
  async addCommentReaction(params, options2) {
    const { roomId, threadId, commentId, data } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/comments/${commentId}/add-reaction`,
      {
        ...data,
        createdAt: data.createdAt?.toISOString()
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const reaction = await res.json();
    return convertToCommentUserReaction(reaction);
  }
  /**
   * Removes a reaction from a comment.
   * @param params.roomId The room ID to remove the comment reaction from.
   * @param params.threadId The thread ID to remove the comment reaction from.
   * @param params.commentId The comment ID to remove the reaction from.
   * @param params.data.emoji The (emoji) reaction to remove.
   * @param params.data.userId The user ID of the user associated with the reaction.
   * @param params.data.removedAt (optional) The date the reaction is set to be removed.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async removeCommentReaction(params, options2) {
    const { roomId, threadId, data } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/threads/${threadId}/comments/${params.commentId}/remove-reaction`,
      {
        ...data,
        removedAt: data.removedAt?.toISOString()
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Returns the inbox notifications for a user.
   * @param params.userId The user ID to get the inbox notifications from.
   * @param params.inboxNotificationId The ID of the inbox notification to get.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getInboxNotification(params, options2) {
    const { userId, inboxNotificationId } = params;
    const res = await this.#get(
      url2`/v2/users/${userId}/inbox-notifications/${inboxNotificationId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return convertToInboxNotificationData(
      await res.json()
    );
  }
  /**
   * Returns the inbox notifications for a user.
   * @param params.userId The user ID to get the inbox notifications from.
   * @param params.query The query to filter inbox notifications by. It is based on our query language and can filter by unread.
   * @param params.organizationId (optional) The organization ID to get the inbox notifications for.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getInboxNotifications(params, options2) {
    const { userId, tenantId, organizationId, limit, startingAfter } = params;
    let query;
    if (typeof params.query === "string") {
      query = params.query;
    } else if (typeof params.query === "object") {
      query = objectToQuery(params.query);
    }
    const queryParams = {
      query,
      limit,
      startingAfter
    };
    if (organizationId !== void 0) {
      queryParams.organizationId = organizationId;
    } else if (tenantId !== void 0) {
      queryParams.organizationId = tenantId;
    }
    const res = await this.#get(
      url2`/v2/users/${userId}/inbox-notifications`,
      queryParams,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const page = await res.json();
    return {
      ...page,
      data: page.data.map(convertToInboxNotificationData)
    };
  }
  /**
   * Iterates over all inbox notifications for a user.
   *
   * The difference with .getInboxNotifications() is that pagination will
   * happen automatically under the hood, using the given `pageSize`.
   *
   * @param criteria.userId The user ID to get the inbox notifications from.
   * @param criteria.query The query to filter inbox notifications by. It is based on our query language and can filter by unread.
   * @param criteria.organizationId (optional) The organization ID to get the inbox notifications for.
   * @param options.pageSize (optional) The page size to use for each request.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async *iterInboxNotifications(criteria, options2) {
    const { signal } = options2 ?? {};
    const pageSize = checkBounds("pageSize", options2?.pageSize ?? 50, 10);
    let cursor = void 0;
    while (true) {
      const { nextCursor, data } = await this.getInboxNotifications(
        { ...criteria, startingAfter: cursor, limit: pageSize },
        { signal }
      );
      for (const item of data) {
        yield item;
      }
      if (!nextCursor) {
        break;
      }
      cursor = nextCursor;
    }
  }
  /**
   * Returns all room subscription settings for a user.
   * @param params.userId The user ID to get the room subscription settings from.
   * @param params.organizationId (optional) The organization ID to get the room subscription settings for.
   * @param params.startingAfter (optional) The cursor to start the pagination from.
   * @param params.limit (optional) The number of items to return.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getUserRoomSubscriptionSettings(params, options2) {
    const { userId, tenantId, organizationId, startingAfter, limit } = params;
    const queryParams = {
      startingAfter,
      limit
    };
    if (organizationId !== void 0) {
      queryParams.organizationId = organizationId;
    } else if (tenantId !== void 0) {
      queryParams.organizationId = tenantId;
    }
    const res = await this.#get(
      url2`/v2/users/${userId}/room-subscription-settings`,
      queryParams,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Gets the user's room subscription settings.
   * @param params.userId The user ID to get the room subscription settings from.
   * @param params.roomId The room ID to get the room subscription settings from.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getRoomSubscriptionSettings(params, options2) {
    const { userId, roomId } = params;
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/users/${userId}/subscription-settings`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Updates the user's room subscription settings.
   * @param params.userId The user ID to update the room subscription settings for.
   * @param params.roomId The room ID to update the room subscription settings for.
   * @param params.data The new room subscription settings for the user.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async updateRoomSubscriptionSettings(params, options2) {
    const { userId, roomId, data } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/users/${userId}/subscription-settings`,
      data,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Delete the user's room subscription settings.
   * @param params.userId The user ID to delete the room subscription settings from.
   * @param params.roomId The room ID to delete the room subscription settings from.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteRoomSubscriptionSettings(params, options2) {
    const { userId, roomId } = params;
    const res = await this.#delete(
      url2`/v2/rooms/${roomId}/users/${userId}/subscription-settings`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Update a room ID.
   * @param params.roomId The current ID of the room.
   * @param params.newRoomId The new room ID.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async updateRoomId(params, options2) {
    const { currentRoomId, newRoomId } = params;
    const res = await this.#post(
      url2`/v2/rooms/${currentRoomId}/update-room-id`,
      { newRoomId },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return inflateRoomData(data);
  }
  /**
   * Triggers an inbox notification for a user.
   * @param params.userId The user ID to trigger the inbox notification for.
   * @param params.kind The kind of inbox notification to trigger.
   * @param params.subjectId The subject ID of the triggered inbox notification.
   * @param params.activityData The activity data of the triggered inbox notification.
   * @param params.roomId (optional) The room ID to trigger the inbox notification for.
   * @param params.organizationId (optional) The organization ID to trigger the inbox notification for.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async triggerInboxNotification(params, options2) {
    const { tenantId, organizationId, ...restParams } = params;
    const body = {
      ...restParams
    };
    if (organizationId !== void 0) {
      body.organizationId = organizationId;
    } else if (tenantId !== void 0) {
      body.organizationId = tenantId;
    }
    const res = await this.#post(
      url2`/v2/inbox-notifications/trigger`,
      body,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Deletes an inbox notification for a user.
   * @param params.userId The user ID for which to delete the inbox notification.
   * @param params.inboxNotificationId The ID of the inbox notification to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteInboxNotification(params, options2) {
    const { userId, inboxNotificationId } = params;
    const res = await this.#delete(
      url2`/v2/users/${userId}/inbox-notifications/${inboxNotificationId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Deletes all inbox notifications for a user.
   * @param params.userId The user ID for which to delete all the inbox notifications.
   * @param params.organizationId (optional) The organization ID to delete the inbox notifications for.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteAllInboxNotifications(params, options2) {
    const { userId, tenantId, organizationId } = params;
    const queryParams = {};
    if (organizationId !== void 0) {
      queryParams.organizationId = organizationId;
    } else if (tenantId !== void 0) {
      queryParams.organizationId = tenantId;
    }
    const res = await this.#delete(
      url2`/v2/users/${userId}/inbox-notifications`,
      queryParams,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Get notification settings for a user for a project.
   * @param params.userId The user ID to get the notifications settings for.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getNotificationSettings(params, options2) {
    const { userId } = params;
    const res = await this.#get(
      url2`/v2/users/${userId}/notification-settings`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const plainSettings = await res.json();
    const settings = createNotificationSettings(plainSettings);
    return settings;
  }
  /**
   * Update the user's notification settings.
   * @param params.userId The user ID to update the notification settings for.
   * @param params.data The new notification settings for the user.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async updateNotificationSettings(params, options2) {
    const { userId, data } = params;
    const res = await this.#post(
      url2`/v2/users/${userId}/notification-settings`,
      data,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const plainSettings = await res.json();
    const settings = createNotificationSettings(plainSettings);
    return settings;
  }
  /**
   * Delete the user's notification settings
   * @param params.userId The user ID to update the notification settings for.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteNotificationSettings(params, options2) {
    const { userId } = params;
    const res = await this.#delete(
      url2`/v2/users/${userId}/notification-settings`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Create a group
   * @param params.groupId The ID of the group to create.
   * @param params.memberIds The IDs of the members to add to the group.
   * @param params.organizationId (optional) The organization ID to create the group for.
   * @param params.scopes (optional) The scopes to grant to the group. The default is `{ mention: true }`.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async createGroup(params, options2) {
    const { tenantId, organizationId, ...restParams } = params;
    const body = {
      ...restParams,
      // The REST API uses `id` since a group is a resource,
      // but we use `groupId` here for consistency with the other methods.
      id: params.groupId
    };
    if (organizationId !== void 0) {
      body.organizationId = organizationId;
    } else if (tenantId !== void 0) {
      body.organizationId = tenantId;
    }
    const res = await this.#post(url2`/v2/groups`, body, options2);
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const group = await res.json();
    return convertToGroupData(group);
  }
  /**
   * Get a group
   * @param params.groupId The ID of the group to get.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getGroup(params, options2) {
    const res = await this.#get(
      url2`/v2/groups/${params.groupId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const group = await res.json();
    return convertToGroupData(group);
  }
  /**
   * Add members to a group
   * @param params.groupId The ID of the group to add members to.
   * @param params.memberIds The IDs of the members to add to the group.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async addGroupMembers(params, options2) {
    const res = await this.#post(
      url2`/v2/groups/${params.groupId}/add-members`,
      { memberIds: params.memberIds },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const group = await res.json();
    return convertToGroupData(group);
  }
  /**
   * Remove members from a group
   * @param params.groupId The ID of the group to remove members from.
   * @param params.memberIds The IDs of the members to remove from the group.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async removeGroupMembers(params, options2) {
    const res = await this.#post(
      url2`/v2/groups/${params.groupId}/remove-members`,
      { memberIds: params.memberIds },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const group = await res.json();
    return convertToGroupData(group);
  }
  /**
   * Delete a group
   * @param params.groupId The ID of the group to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteGroup(params, options2) {
    const res = await this.#delete(
      url2`/v2/groups/${params.groupId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Get all groups
   * @param params.limit (optional) The number of groups to return.
   * @param params.startingAfter (optional) The cursor to start the pagination from.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getGroups(params, options2) {
    const res = await this.#get(
      url2`/v2/groups`,
      { startingAfter: params?.startingAfter, limit: params?.limit },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const page = await res.json();
    return {
      ...page,
      data: page.data.map(convertToGroupData)
    };
  }
  /**
   * Returns all groups a user is a member of.
   * @param params.userId The user ID to get the groups for.
   * @param params.startingAfter (optional) The cursor to start the pagination from.
   * @param params.limit (optional) The number of items to return.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getUserGroups(params, options2) {
    const { userId, startingAfter, limit } = params;
    const res = await this.#get(
      url2`/v2/users/${userId}/groups`,
      { startingAfter, limit },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const page = await res.json();
    return {
      ...page,
      data: page.data.map(convertToGroupData)
    };
  }
  /**
   * Retrieves the current Storage contents for the given room ID and calls the
   * provided callback function, in which you can mutate the Storage contents
   * at will.
   *
   * If you need to run the same mutation across multiple rooms, prefer using
   * `.massMutateStorage()` instead of looping over room IDs yourself.
   */
  async mutateStorage(roomId, callback, options2) {
    return this.#_mutateOneRoom(roomId, void 0, callback, options2);
  }
  /**
   * Retrieves the Storage contents for each room that matches the given
   * criteria and calls the provided callback function, in which you can mutate
   * the Storage contents at will.
   *
   * You can use the `criteria` parameter to select which rooms to process by
   * their metadata. If you pass `{}` (empty object), all rooms will be
   * selected and processed.
   *
   * This method will execute mutations in parallel, using the specified
   * `concurrency` value. If you which to run the mutations serially, set
   * `concurrency` to 1.
   */
  async massMutateStorage(criteria, callback, massOptions) {
    const concurrency = checkBounds(
      "concurrency",
      massOptions?.concurrency ?? 8,
      1,
      20
    );
    const pageSize = Math.max(20, concurrency * 4);
    const { signal } = massOptions ?? {};
    const rooms = this.iterRooms(criteria, { pageSize, signal });
    const options2 = { signal };
    await runConcurrently(
      rooms,
      (roomData) => this.#_mutateOneRoom(roomData.id, roomData, callback, options2),
      concurrency
    );
  }
  async #_mutateOneRoom(roomId, room, callback, options2) {
    const debounceInterval = 200;
    const { signal, abort } = makeAbortController(options2?.signal);
    let opsBuffer = [];
    let outstandingFlush$ = void 0;
    let lastFlush = performance.now();
    const flushIfNeeded = /* @__PURE__ */ __name((force) => {
      if (opsBuffer.length === 0)
        return;
      if (outstandingFlush$) {
        return;
      }
      const now = performance.now();
      if (!(force || now - lastFlush > debounceInterval)) {
        return;
      }
      lastFlush = now;
      const ops = opsBuffer;
      opsBuffer = [];
      outstandingFlush$ = this.#sendMessage(
        roomId,
        [{ type: ClientMsgCode.UPDATE_STORAGE, ops }],
        { signal }
      ).catch((err) => {
        abort(err);
      }).finally(() => {
        outstandingFlush$ = void 0;
      });
    }, "flushIfNeeded");
    try {
      const resp = await this.#requestStorageMutation(roomId, { signal });
      const { actor, nodes } = resp;
      const pool = createManagedPool(roomId, {
        getCurrentConnectionId: /* @__PURE__ */ __name(() => actor, "getCurrentConnectionId"),
        onDispatch: /* @__PURE__ */ __name((ops, _reverse, _storageUpdates) => {
          if (ops.length === 0) return;
          for (const op of ops) {
            opsBuffer.push(op);
          }
          flushIfNeeded(
            /* force */
            false
          );
        }, "onDispatch")
      });
      const root = LiveObject._fromItems(nodes, pool);
      const callback$ = callback({ room, root });
      flushIfNeeded(
        /* force */
        true
      );
      await callback$;
    } catch (e) {
      abort();
      throw e;
    } finally {
      await outstandingFlush$;
      flushIfNeeded(
        /* force */
        true
      );
      await outstandingFlush$;
    }
  }
  async #sendMessage(roomId, messages, options2) {
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/send-message`,
      { messages },
      { signal: options2?.signal }
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Returns a paginated list of AI copilots. The copilots are returned sorted by creation date, from newest to oldest.
   * @param params.limit (optional) A limit on the number of copilots to return. The limit can range between 1 and 100, and defaults to 20.
   * @param params.startingAfter (optional) A cursor used for pagination. You get the value from the response of the previous page.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A paginated list of AI copilots.
   */
  async getAiCopilots(params = {}, options2) {
    const res = await this.#get(
      url2`/v2/ai/copilots`,
      {
        limit: params.limit,
        startingAfter: params.startingAfter
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const page = await res.json();
    return {
      ...page,
      data: page.data.map(inflateAiCopilot)
    };
  }
  /**
   * Creates an AI copilot.
   * @param params The parameters to create the copilot with.
   * @returns The created copilot.
   */
  async createAiCopilot(params, options2) {
    const res = await this.#post(url2`/v2/ai/copilots`, params, options2);
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return inflateAiCopilot(data);
  }
  /**
   * Returns an AI copilot with the given id.
   * @param copilotId The id of the copilot to return.
   * @returns The copilot with the given id.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async getAiCopilot(copilotId, options2) {
    const res = await this.#get(
      url2`/v2/ai/copilots/${copilotId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return inflateAiCopilot(data);
  }
  /**
   * Updates an AI copilot with the given id.
   * @param copilotId The id of the copilot to update.
   * @param params The parameters to update the copilot with.
   * @returns The updated copilot.
   */
  async updateAiCopilot(copilotId, params, options2) {
    const res = await this.#post(
      url2`/v2/ai/copilots/${copilotId}`,
      params,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return inflateAiCopilot(data);
  }
  /**
   * Deletes an AI copilot with the given id. A deleted copilot is no longer accessible from the API or the dashboard and it cannot be restored.
   * @param copilotId The id of the copilot to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteAiCopilot(copilotId, options2) {
    const res = await this.#delete(
      url2`/v2/ai/copilots/${copilotId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Creates a web knowledge source.
   * @param params.url The URL of the web knowledge source.
   * @param params.type The type of the web knowledge source: "individual_link", "crawl" or "sitemap".
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The id of the created web knowledge source.
   */
  async createWebKnowledgeSource(params, options2) {
    const res = await this.#post(
      url2`/v2/ai/copilots/${params.copilotId}/knowledge/web`,
      params,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return data;
  }
  /**
   * Creates a file knowledge source.
   * @param params.copilotId The id of the copilot.
   * @param params.name The name of the file knowledge source.
   * @param params.file The file to create the knowledge source from.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The id of the created file knowledge source.
   */
  async createFileKnowledgeSource(params, options2) {
    const fetch2 = await fetchPolyfill();
    const res = await fetch2(
      urljoin(
        this.#baseUrl,
        url2`/v2/ai/copilots/${params.copilotId}/knowledge/file/${params.file.name}`
      ),
      {
        method: "PUT",
        body: params.file,
        headers: {
          Authorization: `Bearer ${this.#secret}`,
          "Content-Type": params.file.type,
          "Content-Length": String(params.file.size)
        },
        signal: options2?.signal
      }
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return data;
  }
  /**
   * Deletes a file knowledge source.
   * @param params.copilotId The id of the copilot.
   * @param params.knowledgeSourceId The id of the knowledge source to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteFileKnowledgeSource(params, options2) {
    const res = await this.#delete(
      url2`/v2/ai/copilots/${params.copilotId}/knowledge/file/${params.knowledgeSourceId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Deletes a web knowledge source.
   * @param params.copilotId The id of the copilot.
   * @param params.knowledgeSourceId The id of the knowledge source to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteWebKnowledgeSource(params, options2) {
    const res = await this.#delete(
      url2`/v2/ai/copilots/${params.copilotId}/knowledge/web/${params.knowledgeSourceId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Returns a paginated list of knowledge sources.
   * @param params.copilotId The id of the copilot.
   * @param params.limit (optional) A limit on the number of knowledge sources to return. The limit can range between 1 and 100, and defaults to 20.
   * @param params.startingAfter (optional) A cursor used for pagination. You get the value from the response of the previous page.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A paginated list of knowledge sources.
   */
  async getKnowledgeSources(params, options2) {
    const res = await this.#get(
      url2`/v2/ai/copilots/${params.copilotId}/knowledge`,
      {
        limit: params.limit,
        startingAfter: params.startingAfter
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const page = await res.json();
    return {
      ...page,
      data: page.data.map(inflateKnowledgeSource)
    };
  }
  /**
   * Returns a knowledge source with the given id.
   * @param params.copilotId The id of the copilot.
   * @param params.knowledgeSourceId The id of the knowledge source to return.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The knowledge source.
   */
  async getKnowledgeSource(params, options2) {
    const res = await this.#get(
      url2`/v2/ai/copilots/${params.copilotId}/knowledge/${params.knowledgeSourceId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return inflateKnowledgeSource(data);
  }
  /**
   * Returns the content of a file knowledge source.
   * @param params.copilotId The id of the copilot.
   * @param params.knowledgeSourceId The id of the knowledge source.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The content of the file knowledge source.
   */
  async getFileKnowledgeSourceMarkdown(params, options2) {
    const res = await this.#get(
      url2`/v2/ai/copilots/${params.copilotId}/knowledge/file/${params.knowledgeSourceId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const data = await res.json();
    return data.content;
  }
  /**
   * Returns a paginated list of web knowledge source links.
   * @param params.copilotId The id of the copilot.
   * @param params.knowledgeSourceId The id of the knowledge source.
   * @param params.limit (optional) A limit on the number of links to return. The limit can range between 1 and 100, and defaults to 20.
   * @param params.startingAfter (optional) A cursor used for pagination. You get the value from the response of the previous page.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A paginated list of web knowledge source links.
   */
  async getWebKnowledgeSourceLinks(params, options2) {
    const res = await this.#get(
      url2`/v2/ai/copilots/${params.copilotId}/knowledge/web/${params.knowledgeSourceId}/links`,
      {
        limit: params.limit,
        startingAfter: params.startingAfter
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    const page = await res.json();
    return {
      ...page,
      data: page.data.map(inflateWebKnowledgeSourceLink)
    };
  }
  /* -------------------------------------------------------------------------------------------------
   * Feeds
   * -----------------------------------------------------------------------------------------------*/
  /**
   * Returns a list of feeds in a room.
   * @param params.roomId The room ID to get the feeds from.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A list of feeds.
   */
  async getFeeds(params, options2) {
    const { roomId } = params;
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/feeds`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Creates a new feed in a room.
   * @param params.roomId The room ID to create the feed in.
   * @param params.feedId The feed ID.
   * @param params.metadata (optional) The metadata for the feed.
   * @param params.createdAt (optional) Creation time in ms. Sent to the API as `timestamp`. If not provided, the server uses the current time.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The created feed.
   */
  async createFeed(params, options2) {
    const { roomId, feedId, metadata, createdAt } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/feeds`,
      {
        feedId,
        ...metadata !== void 0 ? { metadata } : {},
        ...createdAt !== void 0 ? { timestamp: createdAt } : {}
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Returns a feed with the given id.
   * @param params.roomId The room ID to get the feed from.
   * @param params.feedId The feed ID.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The feed.
   */
  async getFeed(params, options2) {
    const { roomId, feedId } = params;
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/feeds/${feedId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Updates the metadata of a feed.
   * @param params.roomId The room ID to update the feed in.
   * @param params.feedId The feed ID to update.
   * @param params.metadata The metadata for the feed.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The updated feed.
   */
  async updateFeed(params, options2) {
    const { roomId, feedId, metadata } = params;
    const res = await this.#patch(
      url2`/v2/rooms/${roomId}/feeds/${feedId}`,
      { metadata },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Deletes a feed.
   * @param params.roomId The room ID to delete the feed from.
   * @param params.feedId The feed ID to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteFeed(params, options2) {
    const { roomId, feedId } = params;
    const res = await this.#delete(
      url2`/v2/rooms/${roomId}/feeds/${feedId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
  /**
   * Returns a list of messages in a feed.
   * @param params.roomId The room ID to get the feed messages from.
   * @param params.feedId The feed ID to get the messages from.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns A list of feed messages.
   */
  async getFeedMessages(params, options2) {
    const { roomId, feedId } = params;
    const res = await this.#get(
      url2`/v2/rooms/${roomId}/feeds/${feedId}/messages`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Creates a new message in a feed.
   * @param params.roomId The room ID to create the feed message in.
   * @param params.feedId The feed ID to create the message in.
   * @param params.id (optional) The message ID. If not provided, one will be generated.
   * @param params.createdAt (optional) Creation time in ms. Sent to the API as `timestamp`. If not provided, the server uses the current time.
   * @param params.data The message data.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The created feed message.
   */
  async createFeedMessage(params, options2) {
    const { roomId, feedId, id, createdAt, data } = params;
    const res = await this.#post(
      url2`/v2/rooms/${roomId}/feeds/${feedId}/messages`,
      {
        data,
        ...id !== void 0 ? { id } : {},
        ...createdAt !== void 0 ? { timestamp: createdAt } : {}
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Updates a feed message.
   * @param params.roomId The room ID to update the feed message in.
   * @param params.feedId The feed ID to update the message in.
   * @param params.messageId The message ID to update.
   * @param params.data The message data.
   * @param params.updatedAt (optional) Update time in ms. Sent to the API as `timestamp`. If omitted, the server uses the current time.
   * @param options.signal (optional) An abort signal to cancel the request.
   * @returns The updated feed message.
   */
  async updateFeedMessage(params, options2) {
    const { roomId, feedId, messageId, data, updatedAt } = params;
    const res = await this.#patch(
      url2`/v2/rooms/${roomId}/feeds/${feedId}/messages/${messageId}`,
      {
        data,
        ...updatedAt !== void 0 ? { timestamp: updatedAt } : {}
      },
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
    return await res.json();
  }
  /**
   * Deletes a feed message.
   * @param params.roomId The room ID to delete the feed message from.
   * @param params.feedId The feed ID to delete the message from.
   * @param params.messageId The message ID to delete.
   * @param options.signal (optional) An abort signal to cancel the request.
   */
  async deleteFeedMessage(params, options2) {
    const { roomId, feedId, messageId } = params;
    const res = await this.#delete(
      url2`/v2/rooms/${roomId}/feeds/${feedId}/messages/${messageId}`,
      void 0,
      options2
    );
    if (!res.ok) {
      throw await LiveblocksError.from(res);
    }
  }
};
var LiveblocksError = class _LiveblocksError extends Error {
  static {
    __name(this, "_LiveblocksError");
  }
  status;
  details;
  constructor(message, status, details) {
    super(message);
    this.name = "LiveblocksError";
    this.status = status;
    this.details = details;
  }
  toString() {
    let msg = `${this.name}: ${this.message} (status ${this.status})`;
    if (this.details) {
      msg += `
${this.details}`;
    }
    return msg;
  }
  static async from(res) {
    const origErrLocation = new Error();
    Error.captureStackTrace(origErrLocation, _LiveblocksError.from);
    const FALLBACK = "An error happened without an error message";
    let text;
    try {
      text = await res.text();
    } catch {
      text = FALLBACK;
    }
    const obj = tryParseJson(text) ?? { message: text };
    const message = obj.message || FALLBACK;
    const details = [
      obj.suggestion ? `Suggestion: ${String(obj.suggestion)}` : void 0,
      obj.docs ? `See also: ${String(obj.docs)}` : void 0
    ].filter(Boolean).join("\n") || void 0;
    const err = new _LiveblocksError(message, res.status, details);
    err.stack = origErrLocation.stack;
    return err;
  }
};
var WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60;
detectDupes(PKG_NAME2, PKG_VERSION2, PKG_FORMAT2);

// lib/liveblocks.ts
init_esm();
function getLiveblocksClient() {
  if (!global.liveblocksGlobal) {
    global.liveblocksGlobal = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY
    });
  }
  return global.liveblocksGlobal;
}
__name(getLiveblocksClient, "getLiveblocksClient");
async function ensureLiveblocksRoom(roomId) {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not set in this environment");
  }
  if (!secret.startsWith("sk_")) {
    throw new Error(
      `LIVEBLOCKS_SECRET_KEY must be a secret key starting with "sk_" — got a key starting with "${secret.slice(0, 3)}". Check your env vars.`
    );
  }
  const liveblocks = getLiveblocksClient();
  await liveblocks.upsertRoom(roomId, {
    update: {},
    create: { defaultAccesses: [] }
  });
}
__name(ensureLiveblocksRoom, "ensureLiveblocksRoom");

// lib/model-providers.ts
init_esm();
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
var PROVIDER_REGISTRY = {
  gemini: {
    name: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKeyEnv: "GEMINI_API_KEY",
    model: "gemini-2.5-flash",
    responseFormat: "json_schema"
  },
  groq: {
    name: "groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
    model: "llama-3.3-70b-versatile",
    responseFormat: "json_object"
  },
  "openrouter:openai/gpt-oss-120b:free": {
    name: "openrouter:openai/gpt-oss-120b:free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "openai/gpt-oss-120b:free",
    responseFormat: "none"
  },
  "openrouter:qwen/qwen3-coder:free": {
    name: "openrouter:qwen/qwen3-coder:free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "qwen/qwen3-coder:free",
    responseFormat: "none"
  },
  "openrouter:qwen/qwen3-next-80b-a3b-instruct:free": {
    name: "openrouter:qwen/qwen3-next-80b-a3b-instruct:free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "qwen/qwen3-next-80b-a3b-instruct:free",
    responseFormat: "none"
  },
  "openrouter:openrouter/free": {
    name: "openrouter:openrouter/free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "openrouter/free",
    responseFormat: "none"
  }
};
var DEFAULT_PROVIDER_CHAIN_NAMES = [
  "gemini",
  "groq",
  "openrouter:openai/gpt-oss-120b:free",
  "openrouter:qwen/qwen3-coder:free",
  "openrouter:qwen/qwen3-next-80b-a3b-instruct:free",
  "openrouter:openrouter/free"
];
var PROVIDER_CHAIN = (() => {
  const override = process.env.MODEL_PROVIDER_CHAIN;
  const names = override ? override.split(",").map((s) => s.trim()).filter(Boolean) : [...DEFAULT_PROVIDER_CHAIN_NAMES];
  const resolved = names.map((n) => PROVIDER_REGISTRY[n]).filter((p) => Boolean(p));
  if (resolved.length > 0) return resolved;
  return DEFAULT_PROVIDER_CHAIN_NAMES.map((n) => PROVIDER_REGISTRY[n]);
})();
var BACKOFF_DELAYS_MS = [2e3, 5e3, 1e4];
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
__name(sleep, "sleep");
function stripJsonFences(text) {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}
__name(stripJsonFences, "stripJsonFences");
function extractBalancedJson(text) {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}
__name(extractBalancedJson, "extractBalancedJson");
async function callProvider(provider, apiKey, messages, jsonSchema) {
  const body = {
    model: provider.model,
    messages
  };
  if (jsonSchema) {
    if (provider.responseFormat === "json_schema") {
      body.response_format = {
        type: "json_schema",
        json_schema: { name: jsonSchema.name, schema: jsonSchema.schema, strict: true }
      };
    } else if (provider.responseFormat === "json_object") {
      body.response_format = { type: "json_object" };
    }
  }
  let lastError;
  for (let attempt = 0; attempt <= BACKOFF_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        return await res.json();
      }
      const text = await res.text().catch(() => "");
      const retryable = res.status === 429 || res.status >= 500;
      if (retryable && attempt < BACKOFF_DELAYS_MS.length) {
        await sleep(BACKOFF_DELAYS_MS[attempt]);
        continue;
      }
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    } catch (err) {
      lastError = err;
      const isHttpError = err instanceof Error && err.message.startsWith("HTTP ");
      if (!isHttpError && attempt < BACKOFF_DELAYS_MS.length) {
        await sleep(BACKOFF_DELAYS_MS[attempt]);
        continue;
      }
      throw err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
__name(callProvider, "callProvider");
async function generateJson({
  systemPrompt,
  userPrompt,
  jsonSchema,
  validate,
  onAttempt,
  onFallback,
  maxTotalAttempts = 6
}) {
  let totalAttempts = 0;
  let lastError = "no providers were available";
  for (let providerIndex = 0; providerIndex < PROVIDER_CHAIN.length; providerIndex++) {
    const provider = PROVIDER_CHAIN[providerIndex];
    const apiKey = process.env[provider.apiKeyEnv];
    if (!apiKey) {
      onAttempt?.({
        provider: provider.name,
        model: provider.model,
        status: "error",
        error: `missing ${provider.apiKeyEnv}`
      });
      continue;
    }
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];
    let providerFailed = false;
    for (let retry = 0; retry < 2; retry++) {
      if (totalAttempts >= maxTotalAttempts) {
        throw new Error(
          `Exceeded maximum of ${maxTotalAttempts} completion attempts across all providers. Last error: ${lastError}`
        );
      }
      totalAttempts += 1;
      let response;
      try {
        response = await callProvider(provider, apiKey, messages, jsonSchema);
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        onAttempt?.({
          provider: provider.name,
          model: provider.model,
          status: "error",
          error: lastError
        });
        providerFailed = true;
        break;
      }
      const choice = response.choices?.[0];
      const content = choice?.message?.content ?? "";
      const finishReason = choice?.finish_reason ?? "unknown";
      onAttempt?.({
        provider: provider.name,
        model: provider.model,
        status: "ok",
        finishReason,
        contentPreview: content.slice(0, 300)
      });
      const stripped = stripJsonFences(content);
      const jsonText = extractBalancedJson(stripped) ?? stripped;
      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch (err) {
        lastError = `JSON parse error: ${err instanceof Error ? err.message : String(err)}`;
        if (retry === 0) {
          messages.push({ role: "assistant", content });
          messages.push({
            role: "user",
            content: `Your previous response was not valid JSON (${lastError}). Respond again with ONLY the corrected JSON object, no markdown fences and no extra text.`
          });
          continue;
        }
        providerFailed = true;
        break;
      }
      const validation = validate(parsed);
      if (validation.success) return validation.data;
      lastError = validation.error;
      if (retry === 0) {
        messages.push({ role: "assistant", content });
        messages.push({
          role: "user",
          content: `Your JSON did not match the required schema: ${lastError}. Respond again with ONLY the corrected JSON object, no markdown fences and no extra text.`
        });
        continue;
      }
      providerFailed = true;
    }
    if (providerFailed && providerIndex < PROVIDER_CHAIN.length - 1) {
      onFallback?.({
        from: provider.name,
        to: PROVIDER_CHAIN[providerIndex + 1].name,
        reason: lastError
      });
    }
  }
  throw new Error(`All providers in the chain failed. Last error: ${lastError}`);
}
__name(generateJson, "generateJson");
async function generateText({
  systemPrompt,
  userPrompt,
  onAttempt,
  onFallback,
  maxTotalAttempts = 6
}) {
  let totalAttempts = 0;
  let lastError = "no providers were available";
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
  for (let providerIndex = 0; providerIndex < PROVIDER_CHAIN.length; providerIndex++) {
    const provider = PROVIDER_CHAIN[providerIndex];
    const apiKey = process.env[provider.apiKeyEnv];
    if (!apiKey) {
      onAttempt?.({
        provider: provider.name,
        model: provider.model,
        status: "error",
        error: `missing ${provider.apiKeyEnv}`
      });
      continue;
    }
    if (totalAttempts >= maxTotalAttempts) {
      throw new Error(
        `Exceeded maximum of ${maxTotalAttempts} completion attempts across all providers. Last error: ${lastError}`
      );
    }
    totalAttempts += 1;
    let response;
    try {
      response = await callProvider(provider, apiKey, messages);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      onAttempt?.({
        provider: provider.name,
        model: provider.model,
        status: "error",
        error: lastError
      });
      if (providerIndex < PROVIDER_CHAIN.length - 1) {
        onFallback?.({ from: provider.name, to: PROVIDER_CHAIN[providerIndex + 1].name, reason: lastError });
      }
      continue;
    }
    const choice = response.choices?.[0];
    const content = (choice?.message?.content ?? "").trim();
    const finishReason = choice?.finish_reason ?? "unknown";
    onAttempt?.({
      provider: provider.name,
      model: provider.model,
      status: content ? "ok" : "error",
      finishReason,
      contentPreview: content.slice(0, 300)
    });
    if (content) return content;
    lastError = "empty response content";
    if (providerIndex < PROVIDER_CHAIN.length - 1) {
      onFallback?.({ from: provider.name, to: PROVIDER_CHAIN[providerIndex + 1].name, reason: lastError });
    }
  }
  throw new Error(`All providers in the chain failed. Last error: ${lastError}`);
}
__name(generateText, "generateText");

export {
  external_exports,
  LiveMap,
  LiveObject,
  getLiveblocksClient,
  ensureLiveblocksRoom,
  generateJson,
  generateText
};
//# sourceMappingURL=chunk-HAQC75BC.mjs.map
