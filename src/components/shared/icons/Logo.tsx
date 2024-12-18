import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 512 512" // Updated to match the new SVG's dimensions
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Path */}
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0"
        d="M 0 0 L 512 0 L 512 512 L 0 512 L 0 0 Z M 426 36 L 366 71 L 308 116 L 257 196 L 255 203 Q 261 210 273 212 Q 287 213 295 206 L 305 193 L 321 166 L 354 143 L 355 144 L 346 166 L 366 216 L 371 219 L 383 212 Q 389 207 392 198 L 392 186 L 385 164 L 394 140 L 405 157 L 405 188 L 409 202 L 415 211 L 428 218 L 432 217 L 434 215 L 445 185 L 445 172 L 446 171 L 446 136 L 442 112 L 471 103 L 472 101 L 471 95 L 469 94 L 465 94 L 434 104 L 431 108 L 435 138 L 436 139 L 435 183 L 427 204 L 425 205 Q 418 199 416 189 L 416 155 L 399 129 L 388 131 L 376 131 L 375 132 L 360 132 L 359 131 L 352 132 L 316 156 L 292 194 L 287 199 L 278 202 L 268 200 L 268 198 L 313 126 L 370 81 L 428 47 Q 432 46 431 40 L 426 36 Z M 299 43 L 291 46 Q 285 50 282 58 L 282 69 L 284 72 L 251 106 L 252 112 L 265 124 L 270 124 Q 273 123 272 117 L 263 108 L 291 80 L 299 83 Q 309 84 314 79 Q 319 75 321 68 Q 322 57 318 52 Q 313 43 299 43 Z M 208 47 L 202 50 Q 194 54 193 65 Q 193 74 197 79 Q 201 84 208 85 L 208 123 L 240 154 Q 246 155 247 151 L 246 146 L 218 118 L 218 87 L 225 83 Q 231 79 233 71 Q 234 60 230 56 L 222 48 Q 216 46 208 47 Z M 139 76 L 132 79 Q 126 83 123 91 Q 121 102 126 108 Q 130 114 140 116 Q 146 117 150 114 L 153 114 L 175 136 L 180 136 L 182 133 Q 183 128 180 127 L 160 107 L 162 102 Q 164 90 159 85 Q 154 75 139 76 Z M 193 144 L 189 149 L 190 152 L 221 182 L 227 181 L 228 179 Q 229 174 226 173 L 199 145 L 193 144 Z M 109 150 L 101 154 Q 95 159 93 168 L 94 177 L 96 181 Q 101 188 112 190 L 120 189 L 124 187 Q 130 183 132 175 L 165 175 L 192 202 L 196 204 L 199 203 L 201 200 L 200 196 L 170 165 L 134 165 L 129 158 Q 124 149 109 150 Z M 142 206 L 99 248 L 93 246 L 84 246 L 74 251 L 69 260 L 68 265 Q 68 273 72 278 Q 76 285 87 286 Q 97 286 102 281 L 108 271 Q 110 262 106 258 L 106 255 L 142 219 L 160 236 L 165 236 Q 168 235 167 230 L 145 207 L 142 206 Z M 246 213 L 237 216 L 190 226 L 154 274 L 152 276 Q 139 274 134 279 L 92 322 Q 86 326 84 335 L 84 349 L 85 350 L 85 356 L 77 360 Q 66 367 63 383 L 40 405 Q 39 410 43 411 L 48 411 L 63 397 L 64 397 L 65 403 L 70 411 Q 79 425 102 424 L 87 471 L 88 474 L 92 476 L 96 475 L 98 472 L 115 419 L 121 416 Q 127 411 130 403 L 133 400 L 163 389 L 166 389 L 176 394 L 179 394 L 231 373 L 234 370 L 234 366 L 230 359 Q 224 349 212 347 L 199 348 L 182 356 L 176 353 L 185 332 L 216 318 L 234 331 L 240 333 L 247 333 L 255 331 L 269 323 Q 273 322 272 315 L 230 276 L 226 276 L 199 284 L 197 285 L 207 266 L 214 261 L 235 254 L 242 250 Q 250 244 253 234 L 253 216 Q 251 212 246 213 Z M 343 241 L 339 245 L 340 249 L 373 280 L 408 280 L 410 286 Q 414 291 422 294 Q 434 296 440 290 Q 445 286 447 277 Q 447 268 443 263 Q 439 257 433 255 Q 421 253 416 258 Q 409 262 408 269 L 375 269 L 347 241 L 343 241 Z M 316 262 L 312 266 L 313 271 L 343 300 L 346 301 L 349 300 L 351 296 L 350 293 L 321 263 L 316 262 Z M 297 290 L 293 294 L 294 299 L 322 327 L 322 358 L 315 362 Q 309 366 307 374 L 307 383 L 312 392 L 321 397 L 326 398 Q 334 398 339 394 Q 346 390 347 380 L 346 372 L 341 363 L 332 359 L 332 323 L 331 321 L 302 291 L 297 290 Z M 362 308 L 358 312 L 359 317 L 380 338 L 378 343 L 378 354 L 383 363 L 393 368 Q 402 369 408 366 Q 415 362 417 354 Q 419 341 413 336 L 404 329 L 392 329 L 389 331 L 367 309 L 362 308 Z M 290 337 L 251 387 L 247 385 L 240 385 L 231 389 Q 225 393 223 402 Q 222 412 227 418 Q 232 423 240 425 L 246 425 L 254 422 Q 261 417 263 408 Q 263 398 259 394 L 296 346 L 297 340 Q 296 336 290 337 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="1"
        d="M 297.5 54 Q 307.6 52.4 310 58.5 L 311 64.5 L 306.5 71 L 297.5 72 L 292 65.5 L 292 60.5 L 294 56 L 297.5 54 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="1"
        d="M 210.5 57 Q 217.4 56.3 220 59 L 223 67.5 L 217.5 75 L 211.5 76 L 205 71.5 L 204 63.5 L 208.5 58 L 210.5 57 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="1"
        d="M 141.5 86 L 150 89 Q 152.7 91.6 152 98.5 L 147.5 104 L 139.5 105 L 134 100.5 L 133 93.5 L 138.5 87 L 141.5 86 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0"
        d="M 366 142 L 380.5 142 L 381 144.5 L 375 159.5 L 375 166.5 L 382 187.5 L 382 195.5 L 374.5 205 Q 372.3 205.8 373 203.5 L 357 165.5 L 366 142 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="1"
        d="M 111.5 160 Q 119.6 159.9 122 165.5 L 123 170.5 L 118.5 178 L 110.5 179 L 105 174.5 L 104 166.5 L 107.5 162 L 111.5 160 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0"
        d="M 240.5 225 L 243 225 L 243 230.5 L 238 240 L 231.5 244 L 201 255 L 175 302 Q 172.3 303.1 173 300.5 L 162 282.5 L 162 279.5 L 195.5 235 L 199.5 235 L 240.5 225 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="1"
        d="M 86.5 256 Q 94.6 255.9 97 261.5 L 98 267.5 L 93.5 274 L 85.5 275 L 80 270.5 L 79 262.5 L 82.5 258 L 86.5 256 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="1"
        d="M 424.5 265 Q 432.6 264.4 435 269.5 L 436 277.5 L 431.5 283 L 424.5 284 L 420 282 L 417 273.5 L 422.5 266 L 424.5 265 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0" //robot hand
        d="M 142.5 286 L 152.5 286 L 153 287.5 L 176 327.5 L 166.5 348 Q 163.6 345.4 157.5 346 Q 147.5 347.5 143 354.5 Q 138.8 359.3 140 369.5 Q 141.8 377.1 147.5 381 L 150 382.5 L 134.5 389 L 132 376.5 L 129 370.5 L 118.5 359 L 108.5 354 L 95 353 L 94 337.5 L 97 331.5 L 138.5 288 L 142.5 286 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0"
        d="M 225.5 287 L 259 316.5 L 247.5 322 L 239.5 322 L 220.5 308 L 215.5 307 L 183 320 L 180 312.5 L 188 298 L 225.5 287 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="1"
        d="M 394.5 339 Q 402.5 338 405 342.5 Q 407.7 344.8 407 350.5 L 403.5 356 Q 401.2 358.7 395.5 358 L 389 353.5 L 388 345.5 L 392.5 340 L 394.5 339 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0"
        d="M 155.5 357 L 163.5 358 L 179.5 367 L 182.5 367 L 201.5 358 L 208.5 357 L 215.5 359 L 221 363.5 L 219.5 366 L 175.5 383 L 155.5 374 L 151 369.5 L 150 364.5 L 155.5 357 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0"
        d="M 92.5 364 Q 112.5 362.5 119 374.5 L 123 384.5 L 123 392.5 Q 120.4 403.4 112.5 409 Q 106.2 414.7 92.5 413 Q 83.3 410.2 78 403.5 Q 72.7 397.3 73 385.5 Q 75.2 373.7 83.5 368 L 92.5 364 Z M 98 383 L 92 387 Q 91 393 96 394 L 102 393 Q 105 392 104 386 Q 103 382 98 383 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="1"
        d="M 325.5 368 L 328.5 368 L 335 372.5 L 336 380.5 L 331.5 386 L 323.5 387 L 319 383.5 L 317 376.5 L 322.5 369 L 325.5 368 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="1"
        d="M 239.5 396 Q 248.5 394.5 251 399.5 L 252 408.5 L 248.5 413 L 239.5 414 L 235 410.5 L 233 404.5 L 237.5 397 L 239.5 396 Z "
      />
      <path
        className="fill-current text-text stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 425.5 36 L 431 39.5 Q 432 46 427.5 47 L 369.5 81 L 313 125.5 L 268 197.5 L 268 200 L 277.5 202 L 286.5 199 L 292 193.5 L 315.5 156 L 351.5 132 L 358.5 131 L 359.5 132 L 374.5 132 L 375.5 131 L 387.5 131 L 398.5 129 L 416 154.5 L 416 188.5 Q 418 199 424.5 205 L 427 203.5 L 435 182.5 L 436 138.5 L 435 137.5 L 431 107.5 L 433.5 104 L 464.5 94 L 468.5 94 L 471 95 L 472 100.5 L 471 103 L 442 112 L 446 135.5 L 446 170.5 L 445 171.5 L 445 184.5 L 434 214.5 L 431.5 217 L 427.5 218 L 415 211 L 409 201.5 L 405 187.5 L 405 156.5 L 393.5 140 L 385 163.5 L 392 185.5 L 392 197.5 Q 389.2 206.7 382.5 212 L 370.5 219 L 366 215.5 L 346 165.5 L 355 143.5 L 353.5 143 L 321 165.5 L 305 192.5 L 294.5 206 Q 287.1 212.6 272.5 212 Q 261.2 209.8 255 202.5 L 257 195.5 L 307.5 116 L 365.5 71 L 425.5 36 Z M 366 142 L 357 166 L 373 204 Q 372 206 375 205 L 382 196 L 382 188 L 375 167 L 375 160 L 381 145 L 381 142 L 366 142 Z "
      />
      <path
        className="fill-current text-text stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 245.5 213 Q 251.3 212.2 253 215.5 L 253 233.5 Q 249.9 244.4 241.5 250 L 234.5 254 L 213.5 261 L 207 265.5 L 197 284.5 L 198.5 284 L 225.5 276 L 229.5 276 L 272 314.5 Q 273.3 321.8 268.5 323 L 254.5 331 L 246.5 333 L 239.5 333 L 233.5 331 L 215.5 318 L 185 331.5 L 176 352.5 L 181.5 356 L 198.5 348 L 211.5 347 Q 224.3 349.3 230 358.5 L 234 365.5 L 234 369.5 L 230.5 373 L 178.5 394 L 175.5 394 L 165.5 389 L 162.5 389 L 132.5 400 L 130 402.5 Q 127.2 411.2 120.5 416 L 115 419 L 98 471.5 L 95.5 475 L 91.5 476 L 88 473.5 L 87 470.5 L 102 424 Q 79.2 424.6 70 410.5 L 65 402.5 L 64 397 L 62.5 397 L 47.5 411 L 42.5 411 Q 39 410 40 404.5 L 63 382.5 Q 65.7 367.2 76.5 360 L 85 356 L 85 349.5 L 84 348.5 L 84 334.5 Q 86.4 326.4 92 321.5 L 133.5 279 Q 139 274 151.5 276 L 154 273.5 L 189.5 226 L 236.5 216 L 245.5 213 Z M 241 225 L 200 235 L 196 235 L 162 280 L 162 283 L 173 301 Q 172 303 175 302 L 201 255 L 232 244 L 238 240 L 243 231 L 243 225 L 241 225 Z M 143 286 L 139 288 L 97 332 L 94 338 L 95 353 L 109 354 L 119 359 L 129 371 L 132 377 L 135 389 L 150 383 L 148 381 Q 142 377 140 370 Q 139 359 143 355 Q 147 347 158 346 Q 164 345 167 348 L 176 328 L 153 288 L 153 286 L 143 286 Z M 226 287 L 188 298 L 180 313 L 183 320 L 216 307 L 221 308 L 240 322 L 248 322 L 259 317 L 226 287 Z M 156 357 L 150 365 L 151 370 L 156 374 L 176 383 L 220 366 L 221 364 L 216 359 L 209 357 L 202 358 L 183 367 L 180 367 L 164 358 L 156 357 Z M 93 364 L 84 368 Q 75 374 73 386 Q 73 397 78 404 Q 83 410 93 413 Q 106 415 113 409 Q 120 403 123 393 L 123 385 L 119 375 Q 113 362 93 364 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 298.5 43 Q 312.8 42.8 318 51.5 Q 322.3 56.7 321 67.5 Q 319.1 75.2 313.5 79 Q 308.7 83.7 298.5 83 L 290.5 80 L 263 107.5 L 272 116.5 Q 273.3 122.8 269.5 124 L 264.5 124 L 252 111.5 L 251 105.5 L 284 71.5 L 282 68.5 L 282 57.5 Q 284.6 50.1 290.5 46 L 298.5 43 Z M 298 54 L 294 56 L 292 61 L 292 66 L 298 72 L 307 71 L 311 65 L 310 59 Q 308 52 298 54 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 207.5 47 Q 216.4 45.6 221.5 48 L 230 55.5 Q 234.2 60.3 233 70.5 Q 230.8 78.9 224.5 83 L 218 86.5 L 218 117.5 L 246 145.5 L 247 150.5 Q 246 155 239.5 154 L 208 122.5 L 208 85 Q 200.6 84.4 197 78.5 Q 193 73.5 193 64.5 Q 194.5 54.5 201.5 50 L 207.5 47 Z M 211 57 L 209 58 L 204 64 L 205 72 L 212 76 L 218 75 L 223 68 L 220 59 Q 217 56 211 57 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 138.5 76 Q 153.9 75.1 159 84.5 Q 163.8 89.7 162 101.5 L 160 106.5 L 180 126.5 Q 182.6 127.9 182 132.5 L 179.5 136 L 174.5 136 L 152.5 114 L 149.5 114 Q 146.2 116.7 139.5 116 Q 130.4 114.1 126 107.5 Q 121.2 102.3 123 90.5 Q 125.6 83.1 131.5 79 L 138.5 76 Z M 142 86 L 139 87 L 133 94 L 134 101 L 140 105 L 148 104 L 152 99 Q 153 92 150 89 L 142 86 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 192.5 144 L 198.5 145 L 226 172.5 Q 228.6 173.9 228 178.5 L 227 181 L 220.5 182 L 190 151.5 L 189 148.5 L 192.5 144 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 108.5 150 Q 123.7 148.8 129 157.5 L 133.5 165 L 169.5 165 L 200 195.5 L 201 199.5 L 198.5 203 L 195.5 204 L 191.5 202 L 164.5 175 L 132 175 Q 130.4 183 123.5 187 L 119.5 189 L 111.5 190 Q 100.6 188.4 96 180.5 L 94 176.5 L 93 167.5 Q 94.9 158.9 100.5 154 L 108.5 150 Z M 112 160 L 108 162 L 104 167 L 105 175 L 111 179 L 119 178 L 123 171 L 122 166 Q 120 160 112 160 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 141.5 206 L 144.5 207 L 167 229.5 Q 167.6 234.6 164.5 236 L 159.5 236 L 141.5 219 L 106 254.5 L 106 257.5 Q 109.5 261.5 108 270.5 L 101.5 281 Q 96.5 286 86.5 286 Q 76.5 284.5 72 277.5 Q 68.2 272.8 68 264.5 L 69 259.5 L 74 251 L 83.5 246 L 92.5 246 L 98.5 248 L 141.5 206 Z M 87 256 L 83 258 L 79 263 L 80 271 L 86 275 L 94 274 L 98 268 L 97 262 Q 95 256 87 256 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 342.5 241 L 346.5 241 L 374.5 269 L 408 269 Q 409.4 261.7 415.5 258 Q 420.7 253.2 432.5 255 Q 439.3 257.3 443 262.5 Q 447 267.5 447 276.5 Q 445.5 285.5 439.5 290 Q 434.2 295.7 421.5 294 Q 414.1 291.4 410 285.5 L 408 280 L 372.5 280 L 340 248.5 L 339 244.5 L 342.5 241 Z M 425 265 L 423 266 L 417 274 L 420 282 L 425 284 L 432 283 L 436 278 L 435 270 Q 433 264 425 265 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 315.5 262 L 320.5 263 L 350 292.5 L 351 295.5 L 348.5 300 L 345.5 301 L 342.5 300 L 313 270.5 L 312 265.5 L 315.5 262 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 296.5 290 L 301.5 291 L 331 320.5 L 332 322.5 L 332 359 L 341 363 L 346 371.5 L 347 379.5 Q 345.5 389.5 338.5 394 Q 333.8 397.8 325.5 398 L 320.5 397 L 312 392 L 307 382.5 L 307 373.5 Q 309.1 366.1 314.5 362 L 322 357.5 L 322 326.5 L 294 298.5 L 293 293.5 L 296.5 290 Z M 326 368 L 323 369 L 317 377 L 319 384 L 324 387 L 332 386 L 336 381 L 335 373 L 329 368 L 326 368 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 361.5 308 L 366.5 309 L 388.5 331 L 391.5 329 L 403.5 329 L 413 335.5 Q 418.7 340.8 417 353.5 Q 414.6 362.1 407.5 366 Q 402.4 369.4 392.5 368 L 383 363 L 378 353.5 L 378 342.5 L 380 337.5 L 359 316.5 L 358 311.5 L 361.5 308 Z M 395 339 L 393 340 L 388 346 L 389 354 L 396 358 Q 401 359 404 356 L 407 351 Q 408 345 405 343 Q 402 338 395 339 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 289.5 337 Q 295.8 335.8 297 339.5 L 296 345.5 L 259 393.5 Q 263.5 398 263 407.5 Q 261 417.5 253.5 422 L 245.5 425 L 239.5 425 Q 231.8 422.8 227 417.5 Q 222.1 412.4 223 401.5 Q 224.7 393.2 230.5 389 L 239.5 385 L 246.5 385 L 250.5 387 L 289.5 337 Z M 240 396 L 238 397 L 233 405 L 235 411 L 240 414 L 249 413 L 252 409 L 251 400 Q 249 394 240 396 Z "
      />
      <path
        className="fill-current stroke-current"
        strokeWidth="1"
        opacity="0.9764705882352941"
        d="M 97.5 383 Q 102.6 382.4 104 385.5 Q 105.3 391.8 101.5 393 L 95.5 394 Q 91 393 92 386.5 L 97.5 383 Z "
      />
    </svg>
  );
}