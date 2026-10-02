package com.geodora.ai;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final int REQUEST_CODE = 100;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestPermissions();
    }

    private void requestPermissions() {

        if (Build.VERSION.SDK_INT >= 33) {

            String[] permissions = {
                Manifest.permission.READ_MEDIA_IMAGES,
                Manifest.permission.READ_MEDIA_VIDEO
            };

            ActivityCompat.requestPermissions(
                this,
                permissions,
                REQUEST_CODE
            );

        } else {

            String[] permissions = {
                Manifest.permission.READ_EXTERNAL_STORAGE
            };

            ActivityCompat.requestPermissions(
                this,
                permissions,
                REQUEST_CODE
            );
        }
    }

    public void openExternalUrl(String url) {

        try {

            Intent intent =
                new Intent(Intent.ACTION_VIEW, Uri.parse(url));

            startActivity(intent);

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}
