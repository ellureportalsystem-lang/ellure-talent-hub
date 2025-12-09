# Supabase Schema Retrieval Method

## Method Name: **RPC-Based Schema Introspection**

This method uses a PostgreSQL function (RPC) to retrieve the complete database schema programmatically via the Supabase client. It provides real-time, up-to-date schema information without requiring Docker or direct database access.

---

## Overview

This method consists of two parts:
1. **SQL Function Setup**: A PostgreSQL function that queries `information_schema` and `pg_catalog` to gather all schema metadata
2. **Node.js Script**: A script that calls the function via Supabase RPC and formats the output

### Why This Method is Best

✅ **Always Up-to-Date**: Queries the live database schema in real-time  
✅ **No Docker Required**: Works without Docker Desktop  
✅ **Comprehensive**: Retrieves tables, columns, constraints, indexes, functions, triggers, views, sequences, and custom types  
✅ **Reusable**: Once set up, can be run anytime with a single command  
✅ **Programmatic**: Can be integrated into build processes or CI/CD pipelines  
✅ **Safe**: Uses read-only queries, no modifications to database structure

---

## Prerequisites

1. Node.js installed
2. `@supabase/supabase-js` package installed (`npm install @supabase/supabase-js`)
3. `.env` file with:
   - `VITE_SUPABASE_URL` (or `SUPABASE_URL`)
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Access to Supabase SQL Editor

---

## Setup Instructions (One-Time)

### Step 1: Create the SQL Function

1. Go to your Supabase Dashboard SQL Editor:
   - URL: `https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/editor`
   - Or navigate: Dashboard → SQL Editor

2. Open the file: `scripts/getCompleteSchemaFunction.sql`

3. Copy the entire contents of the file

4. Paste into the SQL Editor and click **Run** (or press `Ctrl+Enter`)

5. You should see: `Success. No rows returned`

The function `get_complete_schema()` is now created in your database and can be called anytime.

---

## Usage Instructions (Every Time You Need Schema)

### Step 1: Run the Node.js Script

Open your terminal in the project root and run:

```bash
node scripts/queryCompleteSchema.js
```

### Step 2: View Results

The script will:
- ✅ Display the complete schema in the terminal (formatted and readable)
- ✅ Save the schema to `schema.json` in the project root (for reference/version control)

---

## What Gets Retrieved

The method retrieves the following schema information:

### 1. **Tables** (`tables`)
   - All tables in the `public` schema
   - All columns with:
     - Column name
     - Data type (with precision/scale for numeric types)
     - Character length (for text types)
     - Nullability
     - Default values
     - Ordinal position

### 2. **Primary Keys** (`primary_keys`)
   - Table name
   - Constraint name
   - Column(s) that form the primary key

### 3. **Foreign Keys** (`foreign_keys`)
   - Source table and column
   - Referenced table and column
   - Constraint name

### 4. **Unique Constraints** (`unique_constraints`)
   - Table name
   - Constraint name
   - Column(s) with unique constraint

### 5. **Indexes** (`indexes`)
   - Table name
   - Index name
   - Complete index definition (CREATE INDEX statement)

### 6. **Functions** (`functions`)
   - Function name
   - Routine type
   - Return data type
   - Complete function definition

### 7. **Triggers** (`triggers`)
   - Trigger name
   - Target table
   - Event type (INSERT, UPDATE, DELETE)
   - Timing (BEFORE, AFTER)
   - Action statement

### 8. **Views** (`views`)
   - View name
   - Complete view definition

### 9. **Sequences** (`sequences`)
   - Sequence name
   - Data type
   - Start value, min, max, increment

### 10. **Custom Types** (`types`)
   - Type name
   - Type type (enum, composite, etc.)

---

## Files Involved

### 1. `scripts/getCompleteSchemaFunction.sql`
   - **Purpose**: Creates the PostgreSQL function `get_complete_schema()`
   - **When to use**: Run once in Supabase SQL Editor (or re-run if function is dropped)
   - **Contains**: SQL function definition that queries all schema metadata
   - **Location**: See file contents below or in `scripts/getCompleteSchemaFunction.sql`

### 2. `scripts/queryCompleteSchema.js`
   - **Purpose**: Calls the function via Supabase RPC and formats output
   - **When to use**: Run anytime you need the latest schema
   - **Dependencies**: 
     - `@supabase/supabase-js`
     - `.env` file with credentials
   - **Output**: 
     - Terminal display (formatted)
     - `schema.json` file (JSON format)

### 3. `schema.json` (Generated)
   - **Purpose**: JSON representation of the complete schema
   - **When created**: Every time you run `queryCompleteSchema.js`
   - **Use cases**: 
     - Version control (track schema changes)
     - Documentation
     - Type generation
     - API documentation

---

## Is the Schema Always Up-to-Date?

**YES!** ✅

The schema retrieved is **always the latest** because:

1. **Real-time Queries**: The function queries `information_schema` and `pg_catalog` directly from your live database
2. **No Caching**: Each execution performs fresh queries
3. **Direct Access**: Uses the same metadata tables that PostgreSQL uses internally
4. **Immediate Reflection**: Any changes to your database (new tables, columns, functions, etc.) are immediately reflected

### When to Re-run

Re-run the script whenever:
- You make schema changes (add/remove tables, columns, etc.)
- You create new functions or triggers
- You want to verify the current state
- Before major deployments
- After migrations

---

## Troubleshooting

### Error: "Could not find the function public.get_complete_schema"

**Solution**: The function hasn't been created yet. Run `scripts/getCompleteSchemaFunction.sql` in Supabase SQL Editor first.

### Error: "Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"

**Solution**: Ensure your `.env` file contains:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Error: "Cannot find package '@supabase/supabase-js'"

**Solution**: Install the package:
```bash
npm install @supabase/supabase-js
```

### Function Returns Empty Results

**Possible causes**:
- Database is empty (no tables in `public` schema)
- Wrong schema (check if tables are in a different schema)
- Permissions issue (service role key should have access)

---

## Advanced Usage

### Integrate into Build Process

Add to `package.json`:
```json
{
  "scripts": {
    "schema:fetch": "node scripts/queryCompleteSchema.js"
  }
}
```

Then run: `npm run schema:fetch`

### Use Schema JSON Programmatically

```javascript
import { readFileSync } from 'fs';
const schema = JSON.parse(readFileSync('schema.json', 'utf-8'));
// Use schema.tables, schema.functions, etc.
```

### Generate TypeScript Types

You can extend the script to generate TypeScript types from the schema JSON.

---

## Method Comparison

| Method | Docker Required | Always Up-to-Date | Comprehensive | Reusable |
|--------|----------------|-------------------|---------------|----------|
| **RPC-Based (This Method)** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| Supabase CLI with Docker | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Supabase CLI without Docker | ❌ No | ✅ Yes | ⚠️ Limited | ⚠️ Limited |
| Dashboard SQL Editor | ❌ No | ✅ Yes | ✅ Yes | ❌ Manual |
| psql Direct Connection | ❌ No | ✅ Yes | ✅ Yes | ⚠️ Requires password |

---

## Summary

**Method Name**: RPC-Based Schema Introspection

**Quick Start**:
1. One-time setup: Run `scripts/getCompleteSchemaFunction.sql` in Supabase SQL Editor
2. Every time: Run `node scripts/queryCompleteSchema.js`

**Result**: Always get the latest, complete database schema in both terminal output and `schema.json` file.

---

## Notes

- The function uses `SECURITY DEFINER` to ensure it can access all schema metadata
- The function is granted to `anon` and `authenticated` roles for flexibility
- The service role key is required for full access to all metadata
- The `schema.json` file can be added to `.gitignore` if you don't want to track it, or committed to track schema changes over time

---

*Last Updated: 2025-12-01*

